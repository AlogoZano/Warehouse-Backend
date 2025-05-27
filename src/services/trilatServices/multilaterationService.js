// services/rssiAggregatorService.js
const math = require('mathjs');
const service = require('./trilatService');
const path = require('path');
const fs = require('fs');

const readings = new Map(); // Map of transmitterId => { rssi1, rssi2, rssi3, rssi4 }
let prev_time = 0;
let delta_time = 0;


const csvPath = path.join(__dirname, 'ekf_states.csv');
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'x,y\n');
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
    delta_time = timeStamp - prev_time;
    console.log('Tiempo: ', delta_time);
    prev_time = timeStamp;

    try {
      pos = service.estimatePosition(fullReadings);
      
      console.log('x: ', pos[0], '   y: ', pos[1]);
      const x = pos[0];
      const y = pos[1];
    
      const line = `${x},${y}\n`;
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