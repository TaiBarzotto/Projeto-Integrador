"use strict";
module.exports = (sequelize, DataTypes) => {
  const Categoria_Despesa = sequelize.define(
    "Categoria_Despesa",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      descricao: DataTypes.STRING,
      nome: DataTypes.STRING,
    },
    {
      tableName: "categoria_despesa",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Categoria_Despesa.associate = (models) => {
    Categoria_Despesa.hasMany(models.Despesa, {
      foreignKey: "fk_categoria_despesa",
      as: "despesas",
    });
  };

  return Categoria_Despesa;
};
