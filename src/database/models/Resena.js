module.exports = (sequelize, DataTypes) => {
    let alias = "Resenas";
    let cols = {
        idresena: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        apellido: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        puntuacion: {
            type: DataTypes.INTEGER(5),
            allowNull: true
        },
        mostrar: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false 
        }
    };
    let config = {
        tableName: "resena",
        timestamps: false
    };

    const Resena = sequelize.define(alias, cols, config);

    return Resena;
};
