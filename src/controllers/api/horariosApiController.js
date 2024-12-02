const db = require('../../database/models');

exports.obtenerHorariosConIntervalos = async (req, res) => {
    const { diaSemana } = req.params; // Recibimos el día de la semana desde los parámetros de la URL
    console.log("Valor de dia_semana:", diaSemana);

    try {
        // Buscar el día de la semana por su nombre
        const dia = await db.Dia.findOne({
            where: { dia_semana: diaSemana }, // Buscar el día en la base de datos
            include: [{ model: db.HorarioIntervalo, as: 'horarios' }] // Incluir los horarios
        });

        if (!dia) {
            return res.status(404).json({ success: false, message: 'Día no encontrado' });
        }

        // Procesar los horarios
        const horarios = dia.horarios.map(horario => {
            const intervalos = [];
            const startTime = new Date(`1970-01-01T${horario.hora_inicio}`); // Hora de inicio
            const endTime = new Date(`1970-01-01T${horario.hora_fin}`); // Hora de fin

            // Generar intervalos de 15 minutos
            let currentTime = new Date(startTime); // Crear una copia de startTime para el bucle
            while (currentTime <= endTime) {
                intervalos.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                currentTime.setMinutes(currentTime.getMinutes() + 15); // Incrementar 15 minutos
            }

            return {
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                intervalos
            };
        });

        // Verificar si no hay horarios disponibles para ese día
        if (horarios.length === 0) {
            return res.status(404).json({ success: false, message: 'No hay horarios disponibles para este día' });
        }

        // Devolver la respuesta con el día formateado y los horarios
        res.status(200).json({
            success: true,
            dia: dia.dia_semana.charAt(0).toUpperCase() + dia.dia_semana.slice(1), // Formatear el nombre del día
            horarios
        });
    } catch (error) {
        console.error('Error al obtener los horarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los horarios' });
    }
};


exports.obtenerFechasBloqueadas = async (req, res) => {
    try {
      // Obtener todas las fechas bloqueadas desde la base de datos
      const fechasBloqueadas = await db.FechasBloqueadas.findAll();
  
      if (!fechasBloqueadas || fechasBloqueadas.length === 0) {
        return res.status(404).json({ success: false, message: 'No hay fechas bloqueadas' });
      }
  
      // Devolver la respuesta con las fechas bloqueadas
      res.status(200).json({
        success: true,
        fechasBloqueadas: fechasBloqueadas.map(fecha => ({
          id: fecha.id,
          fecha: fecha.fecha,
          razon: fecha.razon,
        })),
      });
    } catch (error) {
      console.error('Error al obtener las fechas bloqueadas:', error);
      res.status(500).json({ success: false, message: 'Error al obtener las fechas bloqueadas' });
    }
  };
