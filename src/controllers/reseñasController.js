const db = require('../database/models');


exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await db.Resenas.findAll({
            attributes: ['idresena', 'nombre', 'apellido', 'comentario', 'puntuacion', 'mostrar']
        });
        res.render('resenas', { reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las reseñas');
    }
};



// Eliminar una reseña por ID
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await db.Resenas.destroy({
            where: { idresena: id }
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al eliminar la reseña' });
    }
};



// Cambiar estado "Mostrar" de una reseña por ID
exports.toggleMostrar = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await db.Resenas.findByPk(id);
        if (!review) {
            return res.status(404).json({ success: false, error: 'Reseña no encontrada' });
        }

        // Cambiar el estado de mostrar
        review.mostrar = !review.mostrar;
        await review.save();

        res.json({ success: true, mostrar: review.mostrar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error al cambiar el estado de mostrar' });
    }
};
