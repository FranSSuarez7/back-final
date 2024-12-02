const express = require('express');
const router = express.Router();
const reseñasController = require('../controllers/api/reseñasApiController');
const eventosController = require('../controllers/api/eventosApiController');
const horariosApiController = require('../controllers/api/horariosApiController');
// Reseñas
router.get('/resenas', reseñasController.getAllReviews);

router.post('/resenas', reseñasController.createReview);

// Eventos


router.get('/eventos', eventosController.getEvents);
// horarios


router.get('/horarios/:diaSemana', horariosApiController.obtenerHorariosConIntervalos);

router.get('/mostrarfechasbloquedas',horariosApiController.obtenerFechasBloqueadas)

module.exports = router;
