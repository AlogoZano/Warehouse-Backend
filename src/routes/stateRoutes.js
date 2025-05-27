const express = require('express');
const router = express.Router();
const StateController = require('../controllers/stateController');

router.post('/register', StateController.register);
router.put('/update/:id',StateController.update);
router.post('/delete', StateController.delete);
router.get('/get/:id', StateController.get);
router.get('/get_name', StateController.getNames);

module.exports = router;