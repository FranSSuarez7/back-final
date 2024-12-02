const { Op } = require('sequelize');
const db = require('../database/models');



exports.getNumeroTotalResenas = async (req, res) => {
    try {
        const totalResenas = await db.Resenas.count(); 

        // Enviar la respuesta en formato JSON
        res.json({ totalResenas });
    } catch (error) {
        console.error('Error al obtener el número total de reseñas:', error);
        res.status(500).json({ error: 'Error al obtener el número total de reseñas' });
    }
};

exports.getPromedioCalificacionesAPI = async (req, res) => {
    try {
        const reviews = await db.Resenas.findAll({
            attributes: ['puntuacion'] 
        });

        let totalPuntuacion = 0;
        for (let i = 0; i < reviews.length; i++) {
            totalPuntuacion += reviews[i].puntuacion;
        }
        const promedio = totalPuntuacion / reviews.length;

        // Enviar el promedio como respuesta JSON
        res.json({ promedioCalificaciones: promedio.toFixed(2) });
    } catch (error) {
        console.error('Error al obtener el promedio de calificaciones:', error);
        res.status(500).json({ error: 'Error al obtener el promedio de calificaciones' });
    }
};


    


exports.getCantidadPersonasReservasHoy = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        // Consultar todas las reservas para hoy
        const reservasHoy = await db.Reservas.findAll({
            where: {
                fechaHoraReserva: {
                    [Op.gte]: today,
                    [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Fecha de mañana
                }
            }
        });

        // Calcular la suma total de cantidadPersonas
        let totalPersonas = 0;
        reservasHoy.forEach(reserva => {
            totalPersonas += reserva.cantidadPersonas;
        });

        res.json({ totalPersonas });
    } catch (error) {
        console.error('Error al obtener la cantidad de personas en las reservas para hoy:', error);
        res.status(500).json({ error: 'Error al obtener la cantidad de personas en las reservas para hoy' });
    }
};




// Reservas proximas

exports.getTotalPendiente = async (req, res) => {
    try {
        const horaActual = new Date().toISOString(); 

        // Consultar las reservas pendientes y ordenar por fecha y hora de reserva de forma ascendente
        const totalPendiente = await db.Reservas.findAll({
            where: {
                estado: 'Pendiente',
                fechaHoraReserva: {
                    [Op.gt]: horaActual // Solo reservas con fecha y hora futura
                }
            },
            include: [{
                model: db.Clientes, // Incluir el modelo Clientes
                as: 'Cliente', // Alias utilizado en la asociación
                attributes: ['nombre'] // Especificar que solo se desea el nombre del cliente
            }],
            order: [['fechaHoraReserva', 'ASC']] // Ordenar por fecha y hora de reserva de forma ascendente
        });

        // Enviar la respuesta en formato JSON
        res.json({ totalPendiente });
    } catch (error) {
        console.error('Error al obtener el número total de reservas pendientes:', error);
        res.status(500).json({ error: 'Error al obtener el número total de reservas pendientes' });
    }
};



    // Controlador para obtener reservas pendientes
    exports.getProximasReservas = async (req, res) => {
        try {
            const horaActual = new Date().toISOString(); 
    
            // Consulta para obtener las reservas próximas
            const reservasProximas = await db.Reservas.findAll({
                where: {
                    fechaHoraReserva: {
                        [Op.gt]: horaActual
                    },
                    estado: 'Confirmado'
                },
                include: [{
                    model: db.Clientes,
                    as: 'Cliente',
                    attributes: ['nombre']
                }],
                order: [['fechaHoraReserva', 'ASC']]
            });
    
            // Asegúrate de pasar reservasProximas al renderizar la vista
            res.json(reservasProximas );
        } catch (error) {
            console.error('Error al obtener las próximas reservas:', error);
            res.status(500).json({ error: 'Error al obtener las próximas reservas' });
        }
    };
    