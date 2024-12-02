// src/database/models/FechasBloqueadas.js
module.exports = (sequelize, DataTypes) => {
  const FechasBloqueadas = sequelize.define('FechasBloqueadas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,  // Almacena solo la fecha
      allowNull: false,
    },
    razon: {
      type: DataTypes.STRING,
      allowNull: true,  // Razón del bloqueo (opcional)
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Valor por defecto a la fecha actual
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Valor por defecto a la fecha actual
      onUpdate: DataTypes.NOW,  // Actualizar cuando se haga un cambio
    }
  });

  FechasBloqueadas.associate = (models) => {
    // No necesitamos una relación con 'Dia' si solo bloqueamos fechas
  };

  return FechasBloqueadas;
};
