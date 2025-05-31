// src/services/trilatServices/processRSSIKalman.js

const ExtendedKalmanFilter = require('/home/bee/glaxo_server/src/ExtendedKalman');
const fs = require('fs');
const path = require('path');
const math = require('mathjs');
const io = require('../../../socketIoServer');

// Parámetros de buffer y acumulación de medias
const bufSize = 20;
const batchMeans = [];

// Inicializamos EKF con “anclas dummy” por ahora. Luego las reemplazamos cada vez que hagamos update().
const ekf = new ExtendedKalmanFilter(
  [0, 0, 0, 0],                // estado inicial [x, y, vx, vy]
  math.identity(4).valueOf(), // covarianza inicial 4×4
  0.1,                        // dt
  0.01,                       // accelStd
  1.0                         // rssiNoiseVariance
);

const csvPath = path.join(__dirname, 'ekf_states_2_kalman.csv');
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'x,y\n');
}

// Siguiente función de delay la usamos para simular vs. pausar entre muestras
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * process(rssiArrays, anchorPositions)
 *
 *   • rssiArrays:       un arreglo de exactamente 4 sub‐arreglos, cada uno con bufSize (20) valores numéricos.
 *   • anchorPositions:  un arreglo de exactamente 4 coordenadas [x, y], por ejemplo:
 *                        [ [x1,y1], [x2,y2], [x3,y3], [x4,y4] ]
 *
 * Este método:
 *   1. Verifica que llegaron 4 arreglos de 20 RSSI.
 *   2. Por cada muestra i=0..19, hace predict() + update() usando los valores rssi[i] y las posiciones dinámicas.
 *   3. Acumula (x,y) para calcular un promedio del batch.
 *   4. Cada vez que hayas hecho 20 batches (de 20 muestras cada uno), emite la posición final promedio de las 1000 muestras totales.
 */
async function process(rssiArrays, anchorPositions) {
  // (A) Verificaciones de entrada
  if (
    !Array.isArray(rssiArrays) ||
    rssiArrays.length !== 4 ||
    !Array.isArray(anchorPositions) ||
    anchorPositions.length !== 4
  ) {
    throw new Error(
      'processRSSIKalman: Se esperaban 4 arreglos de RSSI y 4 posiciones de ancla.'
    );
  }
  // Cada rssiArrays[i] debe ser un arreglo de longitud bufSize
  for (let i = 0; i < 4; i++) {
    if (
      !Array.isArray(rssiArrays[i]) ||
      rssiArrays[i].length < bufSize
    ) {
      throw new Error(
        `processRSSIKalman: rssiArrays[${i}] debe tener al menos ${bufSize} valores.`
      );
    }
    // Cada anchorPositions[i] debe ser [x, y] numérico
    if (
      !Array.isArray(anchorPositions[i]) ||
      anchorPositions[i].length !== 2 ||
      typeof anchorPositions[i][0] !== 'number' ||
      typeof anchorPositions[i][1] !== 'number'
    ) {
      throw new Error(
        `processRSSIKalman: anchorPositions[${i}] debe ser [x,y] numérico.`
      );
    }
  }

  let xSum = 0;
  let ySum = 0;

  // (B) Para cada “muestra” dentro de 0..bufSize-1
  for (let sample = 0; sample < bufSize; sample++) {
    // 1. Paso de predicción
    ekf.predict();

    // 2. Antes de llamar a update, necesitamos indicarle al EKF cuáles son las posiciones de anclas
    //    para esta iteración. A diferencia del código previo que tenía anchors fijas, vamos a
    //    reemplazar el array `this.anchors` dentro del EKF con nuestra lista dynamic:
    ekf.anchors = [
      [anchorPositions[0][0], anchorPositions[0][1]],
      [anchorPositions[1][0], anchorPositions[1][1]],
      [anchorPositions[2][0], anchorPositions[2][1]],
      [anchorPositions[3][0], anchorPositions[3][1]]
    ];

    // 3. Construir vector de 4 valores de RSSI en la muestra `sample`
    const rssiVals = [
      rssiArrays[0][sample],
      rssiArrays[1][sample],
      rssiArrays[2][sample],
      rssiArrays[3][sample]
    ];

    // 4. Paso de corrección con estas lecturas
    ekf.update(rssiVals);

    // 5. Extraer estimación de estado (x, y)
    const [x, y] = ekf.x.toArray();
    xSum += x;
    ySum += y;

    // 6. Guardar en CSV (una línea por cada predict+update)
    const line = `${x},${y}\n`;
    fs.appendFile(csvPath, line, (err) => {
      if (err) console.error('Error al escribir CSV:', err);
    });

    // 7. Pequeño delay para simular tiempo entre muestras (si lo necesitas)
    await delay(100);
  }

  // (C) Calcular el promedio de x,y para este batch de 20 muestras
  const xMean = xSum / bufSize;
  const yMean = ySum / bufSize;
  batchMeans.push([xMean, yMean]);

  console.log(`Batch mean: x=${xMean}, y=${yMean}, sample: ${batchMeans.length}`);

  // (D) Cada vez que hayas hecho 20 batches, promedias los 20 valores guardados
  if (batchMeans.length === 20) {
    const totalX = batchMeans.reduce((acc, val) => acc + val[0], 0);
    const totalY = batchMeans.reduce((acc, val) => acc + val[1], 0);
    const finalMeanX = totalX / batchMeans.length; // entre 20
    const finalMeanY = totalY / batchMeans.length; // entre 20

    console.log(
      `\nFinal Position Estimate (Mean of ${20 * bufSize} samples): x=${finalMeanX}, y=${finalMeanY}\n`
    );
    io.emit('position', { x: finalMeanX, y: finalMeanY });

    // Si deseas reiniciar la colección de batchMeans para otra “ronda”
    batchMeans.length = 0;
  }

  return 0;
}

module.exports = process;
