

module.exports = (sequelize, DataTypes) => {
    let alias = "Eventos";
    let cols = {
        idevento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        img: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        marca: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    };
    let config = {
        tableName: "evento",
        timestamps: false
    };

    const Evento = sequelize.define(alias, cols, config);



    return Evento;
};
