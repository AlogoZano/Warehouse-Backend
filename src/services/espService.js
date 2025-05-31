//const processRSSI = require('./trilatServices/processRSSIMulti');
const processRSSI = require('./trilatServices/processRSSIKalman');


const rssiMap = new Map();
let flagFinish = true;

async function newRSSI(id, rssiValues, ws) {
    rssiMap.set(id, rssiValues);
    ws.send(JSON.stringify({ ack: 'processing_complete', delay: 10 }));

    if (rssiMap.size === 4 && flagFinish) {
        console.log('Todos los buffers recibidos');
        flagFinish = false;

        const allRSSI = Array.from(rssiMap.values());
        
        try {
            await processRSSI(allRSSI);  
            ws.send(JSON.stringify({ ack: 'processing_complete', delay: '10' }));  
        } catch (err) {
            console.error('Error in processRSSI:', err);
            ws.send(JSON.stringify({ error: 'processing_failed' }));
        }

        rssiMap.clear();
        flagFinish = true;
    }
}

module.exports = newRSSI;
