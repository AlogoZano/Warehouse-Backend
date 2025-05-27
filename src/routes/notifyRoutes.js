const express = require('express');
const router = express.Router();
const NotifyController = require('../controllers/notifyController');

router.post('/', NotifyController.notify);

module.exports = router;