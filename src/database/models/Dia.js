// models/Dia.js
module.exports = (sequelize, DataTypes) => {
  const Dia = sequelize.define('Dia', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dia_semana: {
      type: DataTypes.ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'),
      allowNull: false
    },
    habilitadoDia: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1
    }
  }, {
    tableName: 'dias',
    timestamps: false
  });

  // Relación con la tabla 'horario_intervalos'
  Dia.associate = (models) => {
    // Un día puede tener muchos intervalos de horario
    Dia.hasMany(models.HorarioIntervalo, {
      foreignKey: 'diaId', // clave foránea en la tabla horario_intervalos
      as: 'horarios' // Alias para acceder a los horarios
    });
  };

  return Dia;
};
