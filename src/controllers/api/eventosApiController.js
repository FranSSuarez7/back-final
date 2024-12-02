const db = require('../../database/models');

exports.getEvents = async (req, res) => {
    try {
        const events = await db.Eventos.findAll({
            attributes: ['titulo', 'fecha', 'descripcion', 'img', 'marca']
        });
        res.json(events); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los eventos');
    }
};
