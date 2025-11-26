"use strict";
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      nome: DataTypes.STRING,
      administrador: DataTypes.BOOLEAN,
      senha: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      tableName: "usuario",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Vendas, {
      foreignKey: "fk_usuario_email",
      as: "vendas",
    });
  };

  return Usuario;
};
