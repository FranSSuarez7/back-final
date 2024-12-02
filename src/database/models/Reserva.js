

module.exports = (sequelize, DataTypes) => {
    let alias = "Reservas";
    let cols = {
        idreserva: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        cliente_idcliente: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidadPersonas: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fechaHoraReserva: {
            type: DataTypes.DATE,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    };
    let config = {
        tableName: "reserva",
        timestamps: false
    };

    const Reserva = sequelize.define(alias, cols, config);
    
    Reserva.associate = function (models) {
        Reserva.belongsTo(models.Clientes, {
            foreignKey: "cliente_idcliente", // Clave externa en la tabla Reservas
            as: "Cliente" // Alias opcional para la relación
        });
    };
    

    return Reserva;
};
