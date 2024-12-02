const express = require('express');
const loginController = require('../controllers/loginController');
const autenticacionLogin = require('../middlewares/autenticacionLogin'); // Asegúrate de que la ruta sea correcta
const router = express.Router();
const cerrarSesion = require('../controllers/cierreDeSesionController'); // Asegúrate de que la ruta sea correcta

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para manejar el inicio de sesión
router.post('/autenticacion/login', loginController.login);

//Ruta para el cierre de Sesion

router.post('/logout', cerrarSesion.logout);

// Rutas protegidas que requieren autenticación
router.get('/dashboard', autenticacionLogin, (req, res) => {
    res.render('dashboard');
});

module.exports = router;
