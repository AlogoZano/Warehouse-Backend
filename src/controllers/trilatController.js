// controllers/rssiController.js
const { addReading } = require('../services/trilatServices/multilaterationService');

const receiveRSSI = (req, res) => {
  
  const { id_antena, rssi, id_tag } = req.body;

  if (
    ![1, 2, 3, 4].includes(id_antena) ||
    typeof rssi !== 'number' ||
    typeof id_tag !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const result = addReading({ id_antena, rssi, id_tag });

  if (result.ready) {
    return res.json({
      message: 'Position computed',
      position: result.position
    });
  }

  res.json({ message: 'RSSI received. Waiting for more modules...' });
};

module.exports = {
  receiveRSSI
};