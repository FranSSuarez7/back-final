const bcrypt = require('bcrypt');
const db = require('../database/models');

let registerController = {
    register: (req, res) => res.render('register'),

    createUser: async (req, res) => {
        try {
            const { nombre, apellido, email, password } = req.body;

            // Verificar si el email ya está registrado
            const existingUser = await db.Usuario.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear un nuevo usuario en la base de datos
            const nuevoUsuario = await db.Usuario.create({
                nombre,
                apellido,
                email,
                password: hashedPassword
            });

            // Enviar una respuesta de éxito
            res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: nuevoUsuario });
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ mensaje: 'Error al registrar usuario' });
        }
    }
};

module.exports = registerController;
