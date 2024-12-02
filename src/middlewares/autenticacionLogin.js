const autenticacionLogin = (req, res, next) => {
    if (req.session.user) {
        console.log('Usuario autenticado:', req.session.user); // Solo para depuración, considera eliminar en producción
        next(); 
    } else {
        console.log('Usuario no autenticado, redirigiendo a /login'); // Solo para depuración
        // Redirige a /login con código de estado 302 (Found) para redireccionamiento temporal
        res.status(302).redirect('/login'); 
    }
};


exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ msg: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Eliminar la cookie de sesión
        res.redirect('/login'); // Redirigir a la página de inicio de sesión
    });
};


module.exports = autenticacionLogin;
