const db = require('../../database/models');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await db.Resenas.findAll({
            where: {
                mostrar: true  
            },
            attributes: ['idresena', 'nombre', 'comentario', 'puntuacion']
        });
        res.json(reviews); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las reseñas');
    }
};



exports.createReview = async (req, res) => {
    try {
        const { nombre, comentario, puntuacion } = req.body;
        console.log('Datos recibidos:', { nombre, comentario, puntuacion }); // Verificación

        const nuevaResena = await db.Resenas.create({
            nombre,
            comentario,
            puntuacion
        });

        res.status(201).json(nuevaResena);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar la reseña');
    }
};