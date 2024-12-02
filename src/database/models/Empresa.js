
module.exports = (sequelize, DataTypes) => {
    let alias = "Empresas";
    let cols = {
        idempresa: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    };
    let config = {
        tableName: "empresa",
        timestamps: false
    };

    const Empresa = sequelize.define(alias, cols, config);

    return Empresa;
};
