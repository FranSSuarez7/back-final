

module.exports = (sequelize, DataTypes) => {
    let alias = "Usuario";
    let cols = {
        idusuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(225),
            allowNull: false
        }
        };
        let config = {
        tableName: "usuario",
        timestamps: false
    };

    const Usuario = sequelize.define(alias, cols, config);

    return Usuario;
};
