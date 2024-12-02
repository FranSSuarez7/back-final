

module.exports = (sequelize, DataTypes) => {
    let alias = "Imagenes";
    let cols = {
        idimagen: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        evento_idevento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    };
    let config = {
        tableName: "imagen",
        timestamps: false
    };

    const Imagen = sequelize.define(alias, cols, config);



    return Imagen;
};
