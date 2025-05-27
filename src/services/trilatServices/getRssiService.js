// services/rssiAggregatorService.js
const math = require('mathjs');
const ExtendedKalmanFilter = require('/home/bee/glaxo_server/src/ExtendedKalman');
const path = require('path');
const fs = require('fs');

const readings = new Map(); // Map of transmitterId => { rssi1, rssi2, rssi3, rssi4 }

const ekf = new ExtendedKalmanFilter(
  [0, 0, 0, 0],          // initial state
  math.identity(4).valueOf(), // initial covariance
  0.2,                  // dt
  0.5,                  // accelStd
  1.0                   // rssiNoiseVariance
);

const csvPath = path.join(__dirname, 'ekf_states.csv');
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'x,y,vx,vy\n');
}

function addReading({ id_antena, rssi, id_tag }) {
  const current = readings.get(id_tag) || {};

  console.log('id_antena:', id_antena, '     id_tag:', id_tag, '    rssi:', rssi);

  // Store reading by receiver ID (1-4)
  current[`rssi${id_antena}`] = rssi;

  readings.set(id_tag, current);

  // When we have all 4
  if (Object.keys(current).length === 4) {
    const fullReadings = readings.get(id_tag);
    readings.delete(id_tag);
    const timeStamp = new Date().getTime();
    console.log('Tiempo: ', timeStamp);

    try {
      ekf.predict();
      const rssiVals = Object.values(fullReadings);
      ekf.update(rssiVals);
      console.log(ekf.x.toArray());
      const x = ekf.x.toArray()[0];
      const y = ekf.x.toArray()[1];
      const vx = ekf.x.toArray()[2];
      const vy = ekf.x.toArray()[3];
      const line = `${x},${y},${vx},${vy}\n`;
      fs.appendFile(csvPath, line, err => {});

      return {
        ready: true,
        position: { x, y }
      };
    } catch (error) {
      return {
        ready: true,
        error: 'Trilateration failed',
        details: error.message
      };
    }
  }

  return { ready: false };
}

module.exports = {
  addReading
};