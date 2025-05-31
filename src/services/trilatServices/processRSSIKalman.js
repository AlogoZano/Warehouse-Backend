const ExtendedKalmanFilter = require('/home/bee/glaxo_server/src/ExtendedKalman');
const fs = require('fs');
const path = require('path');
const math = require('mathjs');
const io = require('../../../socketIoServer')

const bufSize = 20;
const batchMeans = [];

const ekf = new ExtendedKalmanFilter(
  [0, 0, 0, 0],                // initial state
  math.identity(4).valueOf(), // initial covariance
  0.1,                         // dt
  0.01,                        // accelStd
  1.0                          // rssiNoiseVariance
);

const csvPath = path.join(__dirname, 'ekf_states_2_kalman.csv');
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'x,y\n');
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function process([rssi1, rssi2, rssi3, rssi4]) {
  let xSum = 0;
  let ySum = 0;

  for (let sample = 0; sample < bufSize; sample++) {
    ekf.predict();
    const rssiVals = [rssi1[sample], rssi2[sample], rssi3[sample], rssi4[sample]];
    ekf.update(rssiVals);

    const [x, y] = ekf.x.toArray();
    xSum += x;
    ySum += y;

    const line = `${x},${y}\n`;
    fs.appendFile(csvPath, line, () => {});

    await delay(100);
  }


  const xMean = xSum / bufSize;
  const yMean = ySum / bufSize;

  batchMeans.push([xMean, yMean]);

  console.log(`Batch mean: x=${xMean}, y=${yMean}, sample: ${batchMeans.length}`);

  if (batchMeans.length === 20) {
    const totalX = batchMeans.reduce((acc, val) => acc + val[0], 0);
    const totalY = batchMeans.reduce((acc, val) => acc + val[1], 0);
    const finalMeanX = totalX / 50;
    const finalMeanY = totalY / 50;


    console.log(`\nFinal Position Estimate (Mean of 1000 samples): x=${finalMeanX}, y=${finalMeanY}\n`);
    io.emit('position', {x: finalMeanX, y: finalMeanY});

    // Optionally clear batchMeans if you want to reuse it
    batchMeans.length = 0;
  }

  return 0;
}

module.exports = process;
