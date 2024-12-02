// controllers/diaController.js
  const { Dia, HorarioIntervalo } = require('../database/models');

// Crear un día con múltiples intervalos de horarios
exports.crearDiaConHorarios = async (req, res) => {
  const { dia_semana, horarios } = req.body; // horarios es un array de objetos con {hora_inicio, hora_fin}


  if (!dia_semana || !Array.isArray(horarios) || horarios.length === 0) {
    return res.status(400).json({
      error: 'Faltan datos o el formato de horarios es incorrecto.'
    });
  }

  try {

    const nuevoDia = await Dia.create({
      dia_semana
    });

    const horariosCreado = await Promise.all(
      horarios.map(horario => {
    
        if (!horario.hora_inicio || !horario.hora_fin) {
          throw new Error('Faltan las horas de inicio o fin para un intervalo.');
        }

        return HorarioIntervalo.create({
          diaId: nuevoDia.id,
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin,
        });
      })
    );

    return res.status(201).json({
      mensaje: 'Día y horarios creados exitosamente',
      dia: nuevoDia,
      horarios: horariosCreado
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Error al crear el día y los horarios',
      detalles: error.message
    });
  }
};


// Actualizar un día y sus horarios
exports.actualizarHorario = async (req, res) => {
    const { diaId, horarioId } = req.params; 
    const { hora_inicio, hora_fin } = req.body; 
    try {
     
      const horario = await HorarioIntervalo.findOne({
        where: {
          id: horarioId,
          diaId: diaId, 
        }
      });
  
      if (!horario) {
        return res.status(404).json({ error: 'Horario no encontrado o no asociado a este día' });
      }
  
      horario.hora_inicio = hora_inicio;
      horario.hora_fin = hora_fin;
  

      await horario.save();
  
      return res.status(200).json({
        mensaje: 'Horario actualizado exitosamente',
        horario: horario
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Error al actualizar el horario',
        detalles: error.message,
      });
    }
  };



  exports.toggleDiaHabilitado = async (req, res) => {
    const { diaId } = req.params; 
    const { habilitado } = req.body; 
  
    try {

      const dia = await Dia.findByPk(diaId);
  
      if (!dia) {
        return res.status(404).json({ error: 'Día no encontrado' });
      }
  

      dia.habilitado = habilitado;
  

      await dia.save();
  
      return res.status(200).json({
        mensaje: `Día ${habilitado ? 'habilitado' : 'deshabilitado'} exitosamente`,
        dia: dia
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Error al habilitar/deshabilitar el día',
        detalles: error.message,
      });
    }
  };

  // Obtener todos los días con sus intervalos de horarios
 // Obtener todos los días con sus intervalos de horarios
exports.obtenerDiasConHorarios = async (req, res) => {
  try {
    const diasConHorarios = await Dia.findAll({
      include: [
        {
          model: HorarioIntervalo,
          as: 'horarios',
          attributes: ['id', 'hora_inicio', 'hora_fin'],
          where: { habilitado: 1 }, // Solo los horarios habilitados
          order: [['hora_inicio', 'ASC']] // Ordenar los horarios por hora de inicio
        }
      ],
      order: [['id', 'ASC']] // Ordenar los días por ID
    });

    // Organiza los horarios por mañana y tarde, según tu lógica de negocio
    const diasSemanas = diasConHorarios.map(dia => {
      const horariosMañana = [];
      const horariosTarde = [];
      dia.horarios.forEach(horario => {
        const horaInicio = horario.hora_inicio;
        const horaFin = horario.hora_fin;
        if (horaInicio < '12:00:00') {
          horariosMañana.push({ hora_inicio: horaInicio, hora_fin: horaFin });
        } else {
          horariosTarde.push({ hora_inicio: horaInicio, hora_fin: horaFin });
        }
      });

      return {
        id: dia.id,
        dia_semana: dia.dia_semana,
        habilitado: dia.habilitadoDia,
        horariosMañana,
        horariosTarde,
      };
    });

    // Renderiza la vista y envía los datos
    return res.render('horarios', {
      mensaje: 'Días y horarios obtenidos exitosamente',
      diasSemanas
    });
  } catch (error) {
    console.error(error);
    return res.status(500).render('horarios', { 
      error: 'Error al obtener los días y horarios',
      detalles: error.message
    });
  }
};
