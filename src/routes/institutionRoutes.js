const express = require('express');
const router = express.Router();
const InstitutionController = require('../controllers/institutionController');

router.post('/register', InstitutionController.register);
router.put('/update/:id',InstitutionController.update);
router.post('/delete', InstitutionController.delete);
router.get('/get', InstitutionController.get)

module.exports = router;