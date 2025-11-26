"use strict";
module.exports = (sequelize, DataTypes) => {
  const Fornecedor_Estoque = sequelize.define(
    "Fornecedor_Estoque",
    {
      fk_fornecedor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      fk_estoque_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "fornecedor_estoque",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Fornecedor_Estoque;
};
