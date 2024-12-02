const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const reseñasController = require('../controllers/reseñasController');
const autenticacionLogin = require('../middlewares/autenticacionLogin');
const homeController = require('../controllers/homeController');
const dashboardApiController = require('../controllers/dashboardApiController');
const horarioRecurrenteController = require('../controllers/horariosController');
const EventosController = require('../controllers/eventosController');
const fechasBloqueadasController = require('../controllers/fechasBloqueadasController');



const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Aplicar autenticacionLogin a todas las rutas de este router
//router.use(autenticacionLogin);

// Rutas para reservas
router.get('/reservas', reservasController.getAllReservas);
router.get('/reservas/filter', reservasController.filterReservasByDate);
router.get('/edit/:id', reservasController.editReserva);
router.post('/update/:id', reservasController.updateReserva);
router.post('/reservas/:id', reservasController.deleteReserva);
router.put('/reservas/:id/toggle', reservasController.toggleEstadoReserva);
router.get('/reservas/editar/:id', reservasController.editReserva);
router.post('/reservas/editar/:id', reservasController.actualizarReserva);
router.post('/reservas', reservasController.createReserva);

// Rutas para reseñas
router.get('/resenas', reseñasController.getAllReviews);
router.post('/resenas/delete/:id', reseñasController.deleteReview);
router.post('/resenas/:id/toggle', reseñasController.toggleMostrar);

// Rutas para Home

// Rutas para Home
router.get('/home', homeController.getAdminPanel);
router.get('/masvisitados', homeController.getDiasMasVisitados);

//rutas home resena
router.get('/home/resenasTotales', dashboardApiController.getNumeroTotalResenas)
router.get('/home/promedioCalificaciones', dashboardApiController.getPromedioCalificacionesAPI)
router.get('/home/cantidadPersonasHoy', dashboardApiController.getCantidadPersonasReservasHoy)
router.get('/home/totalPendiente', dashboardApiController.getTotalPendiente)
router.get('/home/proximasreservas', dashboardApiController.getProximasReservas)



//Rutas Eventos

router.get('/eventos', EventosController.getAll);
router.post('/eventos', upload.single('img'), EventosController.create);
router.delete('/eventos/delete/:id', EventosController.delete);
router.put('/eventos/:id', upload.single('img'), EventosController.update);



// Rutas para fechas




router.post('/crear-horario', horarioRecurrenteController.crearDiaConHorarios);
router.post('/dias/:diaId/toggle', horarioRecurrenteController.toggleDiaHabilitado);
router.post('/dias/actualizar-horarios', horarioRecurrenteController.actualizarHorario);
router.get('/dias/mostrar-horarios', horarioRecurrenteController.obtenerDiasConHorarios);

// Fechas bloqueadas



router.get('/administrar-fechas', fechasBloqueadasController.mostrarBloqueadorFechas);

router.post('/actualizar-horario', fechasBloqueadasController.actualizarHorario);
router.delete('/eliminar-fecha-bloqueada/:id', fechasBloqueadasController.eliminarFechaBloqueada);


// Crear una fecha bloqueada
router.post('/bloquear-fecha', fechasBloqueadasController.bloquearFecha);




module.exports = router;
