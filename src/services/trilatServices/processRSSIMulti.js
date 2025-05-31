const fs = require('fs');
const { networkInterfaces } = require('os');
const path = require('path');
const math = require('mathjs');
const estimatePos = require('./trilatService')


const bufSize = 200;


const csvPath = path.join(__dirname, 'ekf_states_2_multi.csv');
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'x,y\n');
}


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function process([rssi1, rssi2, rssi3, rssi4]){
    
    for(let sample = 0; sample < bufSize; sample++){
        const posArr = estimatePos.estimatePosition([rssi1[sample], rssi2[sample], rssi3[sample], rssi4[sample]])
        const x = posArr[0];
        const y = posArr[1];
        console.log('x: ', x, '    y: ', y);
        const line = `${x},${y}\n`;
        fs.appendFile(csvPath, line, err => {});

        await delay(100);
    }
    return 0;
}

module.exports = process;