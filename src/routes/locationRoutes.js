const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController');

router.post('/register', LocationController.register);
router.put('/update/:id',LocationController.update);
router.post('/delete', LocationController.delete);
router.get('/get/:id', LocationController.get);

module.exports = router;