const db = require('../database/models');
const path = require('path');
const fs = require('fs');

const EventosController = {
    getAll: async (req, res) => {
        try {
            const eventos = await db.Eventos.findAll();
            res.render('eventos', { eventos });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los eventos');
        }
    },
    create: async (req, res) => {
        try {
            const { titulo, fecha, descripcion, marca } = req.body;
            const img = req.file ? `img/${req.file.filename}` : null;

            const nuevoEvento = await db.Eventos.create({
                titulo,
                fecha,
                descripcion,
                marca,
                img
            });

            res.redirect('/admin/eventos');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear el evento');
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await db.Eventos.destroy({ where: { idevento: id } });
            res.json({ success: true });
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar el evento' });
        }
    },
    update: async (req, res) => {
        try {
            console.log('Body de la solicitud:', req.body);
            console.log('Archivo subido:', req.file);

            const { id } = req.params;
            const { empresa_idempresa, titulo, fecha, descripcion } = req.body;
            let imgPath = null;

            if (req.file) {
                const imgName = Date.now() + path.extname(req.file.originalname);
                imgPath = `/img/${imgName}`;
                const fullPath = path.join(__dirname, '/../public', imgPath);
                fs.writeFileSync(fullPath, req.file.buffer);
            }

            console.log('Datos del evento a actualizar:', { empresa_idempresa, titulo, fecha, descripcion, img: imgPath });

            await db.Eventos.update({ empresa_idempresa, titulo, fecha, descripcion, img: imgPath }, { where: { idevento: id } });
            res.redirect('/eventos');
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            res.status(500).send('Error al actualizar el evento');
        }
    }
};

module.exports = EventosController;
