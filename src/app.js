// Imports
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cors = require('cors');
const session = require('express-session');
const autenticacionLogin = require('./middlewares/autenticacionLogin');



// Llama a dotenv.config() para cargar las variables de entorno desde el archivo .env

// Rutas
const loginRoutes = require('./routes/usuario.routes.js'); // Importa las rutas de login
const adminRoutes = require('./routes/admin.routes.js');
const registerRoutes = require('./routes/register.routes.js');
const api = require('./routes/api.routes.js');

// Inicialización
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// Configuración de sesión
app.use(session({
    secret: 'prueba', // Cambia esto por una cadena secreta más robusta en producción
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Configura esto como `true` si usas HTTPS
}));


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(methodOverride('_method'));

// Rutas
app.use('/', loginRoutes); // Usa las rutas de login
app.get('/', (req, res) => {
    res.redirect('/admin/home');
});
app.use('/', registerRoutes);
app.use('/api', api);
app.use('/admin', adminRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Se conectó correctamente a http://localhost:${PORT}`);
});



// Implementacion de CSRF Seguridad. para otro momento
//const cookieParser = require('cookie-parser');
//const csrf = require('csurf');


// Configuración de cookies y CSRF
//app.use(cookieParser());
//app.use(csrf({ cookie: true }));

/*app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
*/