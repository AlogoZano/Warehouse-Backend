// src/services/espService.js

// Constantes y dependencias tal cual las tenías
const processRSSI = require('./trilatServices/processRSSIKalman');

const rssiMap = new Map();
let batchTimer = null;
const TIME_WINDOW_MS = 25000; // 25 s (ajusta según tu caso)

/**
 * newRSSI(id, espPayload, ws)
 */
async function newRSSI(id, espPayload, ws) {
  // Supongamos que espPayload viene así:
  // {
  //   antena: "A1",
  //   rssi:   [ /* 20 valores */ ],
  //   rssi_avg: -45.2,
  //   position: [x, y]
  // }
  const { rssi_avg } = espPayload;

  // 1. Guardar la última lectura (o sobreescribir si ya existe)
  rssiMap.set(id, espPayload);

  // 2. Enviar un ACK de buffering
  ws.send(JSON.stringify({ ack: 'buffered', antenna: id }));

  // 3. Si no hay timer corriendo, arrancar uno
  if (batchTimer === null) {
    batchTimer = setTimeout(async () => {
      // (A) Resetear el timer para el próximo batch
      batchTimer = null;

      // (B) Ordenar las entradas por rssi_avg descendente
      const sortedEntries = Array.from(rssiMap.entries())
        .sort(([, a], [, b]) => b.rssi_avg - a.rssi_avg);

      // (C) Tomar los 4 primeros id → payload
      const top4 = sortedEntries.slice(0, 4).map(([antennaId, payload]) => ({
        id: antennaId,
        payload
      }));

      // Imprimir en consola los 4 candidatos y sus posiciones
      console.log('--- Top 4 candidatos para Kalman ---');
      top4.forEach((item, idx) => {
        const { id, payload } = item;
        console.log(
          `${idx + 1}. Antena: ${id}  |  rssi_avg: ${payload.rssi_avg}` +
          `  |  Position: [${payload.posicion[0]}, ${payload.posicion[1]}]`
        );
      });
      console.log('---.---------------------------------\n');

      // (D) Construir dos arreglos paralelos:
      //     1) rssiArrays = [ [20 valores], [20 valores], [20 valores], [20 valores] ]
      //     2) anchorPositions = [ [x0, y0], [x1, y1], [x2, y2], [x3, y3] ]
      const rssiArrays = [];
      const anchorPositions = [];

      for (const item of top4) {
        const p = item.payload;

        // Verificar que venga un arreglo de 20 rssi
        if (!Array.isArray(p.rssi) || p.rssi.length < 20) {
          throw new Error(
            `Antena ${item.id} no tiene al menos 20 lecturas en el campo rssi.`
          );
        }
        // Agregar el arreglo completo de 20 valores
        rssiArrays.push(p.rssi);

        // Verificar posición bien formada
        if (
          !Array.isArray(p.posicion) ||
          p.posicion.length !== 2 ||
          typeof p.posicion[0] !== 'number' ||
          typeof p.posicion[1] !== 'number'
        ) {
          throw new Error(
            `Antena ${item.id} no tiene campo position válido ([x,y]).`
          );
        }
        anchorPositions.push([p.posicion[0], p.posicion[1]]);
      }

      // (E) Llamar a processRSSI pasándole ambos arreglos
      // processRSSI espera algo como: ([rssi1, rssi2, rssi3, rssi4], [pos1, pos2, pos3, pos4])
      try {
        await processRSSI(rssiArrays, anchorPositions);
        ws.send(
          JSON.stringify({ ack: 'processing_complete', used: top4.length })
        );
      } catch (err) {
        console.error('Error in processRSSI:', err);
        ws.send(JSON.stringify({ error: 'processing_failed' }));
      }

      // (F) Limpiar todo para el siguiente batch
      rssiMap.clear();
    }, TIME_WINDOW_MS);
  }
}

module.exports = newRSSI;
