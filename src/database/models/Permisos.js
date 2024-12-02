

module.exports = (sequelize, DataTypes) => {
    let alias = "Permisos";
    let cols = {
        idpermisos: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    };
    let config = {
        tableName: "permisos",
        timestamps: false
    };

    const Permiso = sequelize.define(alias, cols, config);

    return Permiso;
};
