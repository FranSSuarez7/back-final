// models/HorarioIntervalo.js
module.exports = (sequelize, DataTypes) => {
    const HorarioIntervalo = sequelize.define('HorarioIntervalo', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      diaId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
      },
      hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
      },
      habilitado: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
      }
    }, {
      tableName: 'horario_intervalos',
      timestamps: false
    });
  
    // Relación con la tabla 'dias'
    HorarioIntervalo.associate = (models) => {
      // Cada intervalo de horario pertenece a un solo día
      HorarioIntervalo.belongsTo(models.Dia, {
        foreignKey: 'diaId',
        as: 'dia' // Alias para acceder al día de este intervalo
      });
    };
  
    return HorarioIntervalo;
  };
  