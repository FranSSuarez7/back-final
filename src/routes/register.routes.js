const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Ruta para mostrar el formulario de registro
router.get('/register', registerController.register);

// Ruta para manejar la creación de un nuevo usuario
router.post('/register', registerController.createUser);

module.exports = router;
