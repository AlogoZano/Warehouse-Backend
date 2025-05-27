const express = require('express');
const router = express.Router();
const HistoryController = require('../controllers/historyController');

router.get('/get/:id', HistoryController.get);

module.exports = router;