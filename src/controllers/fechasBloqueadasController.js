// src/controllers/FechasBloqueadasController.js
const { FechasBloqueadas, Dia, HorarioIntervalo } = require('../database/models');
// src/controllers/FechasBloqueadasController.js


exports.mostrarBloqueadorFechas = async (req, res) => {
  try {
    // Obtener las fechas bloqueadas
    const fechasBloqueadas = await FechasBloqueadas.findAll();
    const fechasBloqueadasData = fechasBloqueadas.map(fecha => fecha.get({ plain: true }));

    // Obtener los días junto con sus intervalos de horario
    const diasSemanas = await Dia.findAll({
      include: {
        model: HorarioIntervalo,
        as: 'horarios', // Alias definido en la relación
        attributes: ['hora_inicio', 'hora_fin'] // Especificamos que solo queremos estas columnas
      }
    });

    // Pasamos las fechas bloqueadas y los días con sus intervalos al renderizado
    res.render('horarios', {
      fechasBloqueadas: fechasBloqueadasData,
      diasSemanas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos');
  }
};



// Crear una fecha bloqueada
/*exports.crearFechaBloqueada = async (req, res) => {
  const { fecha, razon, diaId } = req.body; // Fecha, razón y díaId de la semana

  try {

    const dia = await Dia.findByPk(diaId);
    if (!dia) {
      return res.status(400).json({ error: 'El día de la semana no existe.' });
    }

    const nuevaFechaBloqueada = await FechasBloqueadas.create({
      fecha,
      razon,
      diaId,
    });

    return res.status(201).json({
      mensaje: 'Fecha bloqueada creada exitosamente.',
      fechaBloqueada: nuevaFechaBloqueada,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear la fecha bloqueada.' });
  }
};
*/
// Obtener todas las fechas bloqueadas
// 3. Eliminar una fecha bloqueada


// Bloquear una fecha
exports.bloquearFecha = async (req, res) => {
  const { fecha, razon } = req.body; // Recibe la fecha y razón desde el cuerpo de la solicitud

  try {
    // Verificar si ya existe la fecha bloqueada
    const fechaExistente = await FechasBloqueadas.findOne({
      where: { fecha: fecha }
    });

    if (fechaExistente) {
      return res.status(400).json({ message: 'La fecha ya está bloqueada.' });
    }

    // Crear una nueva entrada de fecha bloqueada
    const nuevaFechaBloqueada = await FechasBloqueadas.create({
      fecha: fecha,
      razon: razon || 'Bloqueo general', // Si no se proporciona razón, se asigna una predeterminada
    });

    return res.status(201).json({
      message: 'Fecha bloqueada exitosamente',
      fechaBloqueada: nuevaFechaBloqueada,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al bloquear la fecha.' });
  }
};


// Controlador (por ejemplo, en horariosController.js)

exports.actualizarHorario = async (req, res) => {
  const { diaId, horarios } = req.body;

  try {
      console.log('Datos recibidos:', req.body);

      // Buscar el día junto con sus horarios
      const dia = await Dia.findOne({
          where: { id: diaId },
          include: [{ model: HorarioIntervalo, as: 'horarios' }]
      });

      if (!dia) {
          return res.status(404).json({ success: false, message: 'Día no encontrado' });
      }

      // Verificar si se encontró horarios para actualizar
      if (!dia.horarios || dia.horarios.length === 0) {
          return res.status(404).json({ success: false, message: 'No se encontraron horarios para este día' });
      }

      // Actualizar los horarios de acuerdo al índice
      horarios.forEach((horario, index) => {
          // Verifica si el índice existe en los horarios actuales
          if (dia.horarios[index]) {
              dia.horarios[index].hora_inicio = horario.hora_inicio;
              dia.horarios[index].hora_fin = horario.hora_fin;
              // Guardar el horario actualizado
              dia.horarios[index].save();
          }
      });

      // Guardar los cambios en el día (si es necesario)
      await dia.save();

      res.status(200).json({ success: true, message: 'Horarios actualizados correctamente' });

  } catch (error) {
      console.error('Error al actualizar los horarios:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar los horarios' });
  }
};


exports.obtenerHorarios = async (req, res) => {
  const { diaId } = req.params;

  try {
      // Buscar el día y sus horarios
      const dia = await Dia.findOne({
          where: { id: diaId },
          include: [{ model: HorarioIntervalo, as: 'horarios' }]
      });

      if (!dia) {
          return res.status(404).json({ success: false, message: 'Día no encontrado' });
      }

      // Extraer solo los horarios de inicio y fin
      const horarios = dia.horarios.map(horario => ({
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin
      }));

      res.status(200).json({ success: true, horarios });
  } catch (error) {
      console.error('Error al obtener los horarios:', error);
      res.status(500).json({ success: false, message: 'Error al obtener los horarios' });
  }
};


// Eliminar una fecha bloqueada
// Controlador
exports.eliminarFechaBloqueada = async (req, res) => {
  const { id } = req.params;

  try {
    const fechaBloqueada = await FechasBloqueadas.findByPk(id);

    if (!fechaBloqueada) {
      return res.status(404).json({ success: false, message: 'Fecha bloqueada no encontrada' });
    }

    await fechaBloqueada.destroy();

    res.status(200).json({ success: true, message: 'Fecha bloqueada eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la fecha bloqueada:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la fecha bloqueada' });
  }
};
