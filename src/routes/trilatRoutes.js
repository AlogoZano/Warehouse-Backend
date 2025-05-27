const express = require('express');
const router = express.Router();
const { receiveRSSI } = require('../controllers/trilatController');

router.post('/', receiveRSSI);

module.exports = router;