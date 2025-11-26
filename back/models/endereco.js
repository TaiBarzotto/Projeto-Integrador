"use strict";
module.exports = (sequelize, DataTypes) => {
  const Endereco = sequelize.define(
    "Endereco",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cep: DataTypes.STRING,
      rua: DataTypes.STRING,
      cidade: DataTypes.STRING,
      bairro: DataTypes.STRING,
      complemento: DataTypes.STRING,
      estado: DataTypes.STRING,
      numero: DataTypes.INTEGER,
    },
    {
      tableName: "endereco",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Endereco.associate = (models) => {
    Endereco.hasMany(models.Cliente, {
      foreignKey: "fk_endereco",
      as: "clientes",
    });
  };

  return Endereco;
};
