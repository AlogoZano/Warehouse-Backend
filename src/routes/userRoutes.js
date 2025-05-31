const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/get', UserController.get);
router.get('/get_operators', UserController.get);
router.post('/delete', UserController.delete);
router.put('/update/:id', UserController.update);

module.exports = router;