const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/packageController');

router.post('/register', PackageController.register);
router.put('/update/:id',PackageController.update);
router.put('/update_location/:id',PackageController.updateLocation);
router.post('/delete', PackageController.delete);
router.get('/get/:id', PackageController.get);
router.get('/get_all', PackageController.getAll);
router.get('/get_state/:id', PackageController.getState);
router.get('/get_location/:id', PackageController.getLocation);
router.get('/get_recent/:num', PackageController.getRecent);

module.exports = router;