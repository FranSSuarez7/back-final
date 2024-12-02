const { Sequelize, Op } = require('sequelize');
const { Reservas } = require('../database/models'); // Ajusta la ruta según la ubicación de tus modelos

// Instancia de Sequelize (asegúrate de que esta configuración esté centralizada y no aquí)
const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nombre de la base de datos
    process.env.DB_USER,     // Usuario de la base de datos
    process.env.DB_PASSWORD, // Contraseña de la base de datos
    {
        host: process.env.DB_HOST,         // Host del servidor
        dialect: process.env.DB_DIALECT,  // Dialecto de la base de datos (mysql, postgres, etc.)
        port: process.env.DB_PORT || 3306 // Puerto (por defecto 3306 para MySQL)
    }
);

exports.getAdminPanel = async (req, res) => {
    try {
        // Consultar reservas agrupadas por mes
        const reservasPorMes = await Reservas.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('fechaHoraReserva')), 'mes'],
                [sequelize.fn('COUNT', sequelize.col('*')), 'total']
            ],
            group: ['mes'],
            raw: true
        });

        // Procesar los datos para el gráfico
        const dataPorMes = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [{
                label: 'Reservas mensuales',
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                data: Array(12).fill(0), // Inicializar con ceros
                tension: 0.1,
                fill: true
            }]
        };

        // Actualizar los datos con la cantidad de reservas por mes
        reservasPorMes.forEach(reserva => {
            const mesIndex = reserva.mes - 1; // los meses en SQL inician en 1, en javascript en 0
            dataPorMes.datasets[0].data[mesIndex] = reserva.total;
        });

        // Renderizar la vista con los datos
        res.render('home', { dataPorMes });

    } catch (error) {
        console.error('Error al obtener datos de reservas:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.getDiasMasVisitados = async (req, res) => {
    try {
        const result = await Reservas.findAll({
            attributes: [
                [Sequelize.fn('DAYOFWEEK', Sequelize.col('fechaHoraReserva')), 'dayOfWeek'],
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'total']
            ],
            group: Sequelize.fn('DAYOFWEEK', Sequelize.col('fechaHoraReserva')),
            order: Sequelize.literal('total DESC')
        });

        console.log('Resultado de la consulta:', result);

        // Procesar el resultado y enviar los datos necesarios al cliente
        const data = result.map(item => ({
            dayOfWeek: item.dataValues.dayOfWeek, // Accede a dataValues para obtener los valores
            total: item.dataValues.total
        }));
        
        // Loguear los datos antes de enviarlos al cliente
        console.log('Datos enviados al cliente:', data);
        
        res.json(data);
    } catch (error) {
        console.error('Error al obtener los días más visitados:', error);
        res.status(500).json({ error: 'Error al obtener los días más visitados' });
    }
};


