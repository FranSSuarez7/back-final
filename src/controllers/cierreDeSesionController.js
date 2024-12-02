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