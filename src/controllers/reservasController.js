const db = require('../database/models');
const { Op } = require('sequelize');



// Obtener todas las reservas con los datos del cliente, fecha y cantidad de personas
exports.getAllReservas = async (req, res) => {
    try {
        const reservas = await db.Reservas.findAll({
            include: {
                model: db.Clientes,
                as: 'Cliente', 
                attributes: ['nombre', 'telefono', 'email'] // Datos talba Cliente
            },
            attributes: ['idreserva','fechaHoraReserva', 'cantidadPersonas','estado','descripcion'] // Selecciona id de Reservas,fechas y cantidad
        });
        res.render('reservas', { reservas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las reservas');
    }
};

// Filtrar reservas por fecha con los datos del cliente, fecha y cantidad de personas
exports.filterReservasByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).send('Por favor, proporcione ambas fechas: inicio y fin.');
        }

        const reservas = await db.Reservas.findAll({
            where: {
                fechaHoraReserva: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            include: {
                model: db.Clientes,
                as: 'Cliente', 
                attributes: ['nombre', 'telefono', 'email'] 
            },
            attributes: ['idreserva','fechaHoraReserva', 'cantidadPersonas','estado'] 
        });
        res.render('reservas', { reservas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al filtrar las reservas');
    }
};


exports.editReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await db.Reservas.findByPk(id);
        if (!reserva) {
            return res.status(404).send('Reserva no encontrada');
        }
        res.render('editarReserva', { reserva });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al editar la reserva');
    }
};

exports.updateReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidadPersonas, fechaHoraReserva } = req.body;
        await db.Reservas.update({
            cantidadPersonas,
            fechaHoraReserva
        }, {
            where: { idreserva: id }
        });
        res.redirect('/admin/reservas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la reserva');
    }
};

exports.deleteReserva = async (req, res) => {
    try {
        const id = req.params.id;
        await db.Reservas.destroy({
            where: { idreserva: id}
        });
        res.status(200).send('Reserva eliminada');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la reserva');
    }
};



exports.toggleEstadoReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { estadoActual } = req.body;
        
        // Encuentra la reserva e incluye el modelo Cliente
        const reserva = await db.Reservas.findByPk(id, {
            include: {
                model: db.Clientes,
                as: 'Cliente', // Incluye el cliente relacionado
                attributes: ['nombre', 'telefono'] // Obtén solo el nombre y el teléfono
            }
        });

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        const nuevoEstado = estadoActual === 'confirmado' ? 'pendiente' : 'confirmado';
        reserva.estado = nuevoEstado;
        await reserva.save();

        // Responde con el nuevo estado y los detalles del cliente y la reserva
        res.status(200).json({
            nuevoEstado,
            nombreCliente: reserva.Cliente.nombre,
            telefonoCliente: reserva.Cliente.telefono,
            fechaHoraReserva: reserva.fechaHoraReserva // Envía la fecha y la hora
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al alternar el estado de la reserva' });
    }
};




  
  exports.getAllReservas = async (req, res) => {
    try {
        const reservas = await db.Reservas.findAll({
            include: {
                model: db.Clientes,
                as: 'Cliente', 
                attributes: ['nombre', 'telefono', 'email'] // Datos talba Cliente
            },
            attributes: ['idreserva','fechaHoraReserva', 'cantidadPersonas','estado',"descripcion"] // Selecciona id de Reservas,fechas y cantidad
        });
        res.render('reservas', { reservas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las reservas');
    }
};


/* EDITAR RESERVAS Y CLIENTE*/

exports.editReserva =  async (req, res) => {
    try {
        const id = req.params.id;
        const reserva = await db.Reservas.findByPk(id, {
            include: [{ model: db.Clientes, as: 'Cliente' }]
        });
        res.render('editar', { reserva });
    } catch (error) {
        res.status(500).send('Error al obtener la reserva');
    }
};


exports.actualizarReserva = async(req,res) =>{
    try {
        const id = req.params.id;
        const {
            nombre,
            telefono,
            email,
            cantidadPersonas,
            fechaHoraReserva,
            estado,
            descripcion
        } = req.body;
        
        // Actualizar reserva
        await db.Reservas.update(
            {
                cantidadPersonas,
                fechaHoraReserva,
                estado,
                descripcion
            },
            {
                where: { idreserva: id }
            }
        );

        // Actualizar cliente asociado
        const reserva = await db.Reservas.findByPk(id);
        await db.Clientes.update(
            {
                nombre,
                telefono,
                email
            },
            {
                where: { idcliente: reserva.cliente_idcliente }
            }
        );

        res.redirect('/admin/reservas'); // Redirigir a la lista de reservas u otra página adecuada
    } catch (error) {
        res.status(500).send('Error al actualizar la reserva y el cliente');
    }
}



exports.createReserva = async (req, res) => {
    try {
        const { fecha, hora, nombre, telefono, email, personas, descripcion } = req.body;

        // Crear el cliente primero
        const cliente = await db.Clientes.create({
            nombre: nombre,
            telefono: telefono,
            email: email, // Usando el email del formulario
        });

        // Crear la reserva
        const reserva = await db.Reservas.create({
            fechaHoraReserva: `${fecha} ${hora}`,
            cantidadPersonas: personas,
            estado: 'pendiente',
            descripcion: descripcion,
            cliente_idcliente: cliente.idcliente // Usar 'idcliente' del modelo Cliente
        });

        res.status(201).json(reserva);
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).send('Error al crear la reserva');
    }
};
