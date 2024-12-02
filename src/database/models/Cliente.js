module.exports = (sequelize, DataTypes) => {
    let alias = "Clientes";
    let cols = {
        idcliente: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(75),
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(75),
            allowNull: false
        }
    };
    let config = {
        tableName: "cliente",
        timestamps: false
    };

    

    const Cliente = sequelize.define(alias, cols, config);
    
    Cliente.associate = function (models) {
        Cliente.hasMany(models.Reservas, {
            foreignKey: 'cliente_idcliente',
            as: 'Reservas' // Cambiado a plural para reflejar la relación
        });
    };
    
    return Cliente;
};
