const bcrypt = require('bcrypt');
const db = require('../database/models');
const User = db.Usuario;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Intento de inicio de sesión con email:', email);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Contraseña incorrecta');
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Establece la sesión del usuario
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email
        };
        console.log('Usuario autenticado:', req.session.user);

        // Redirige al dashboard u otra página después del login exitoso
        res.status(200).redirect('/admin/reservas');
    } catch (err) {
        console.error('Error al iniciar sesión:', err.message);
        res.status(500).send('Error en el servidor');
    }
};
