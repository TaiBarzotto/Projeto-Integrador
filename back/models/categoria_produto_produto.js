"use strict";
module.exports = (sequelize, DataTypes) => {
  const Categoria_Produto_Produto = sequelize.define(
    "Categoria_Produto_Produto",
    {
      fk_categoria_produto_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      fk_produto_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "categoria_produto_produto",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Categoria_Produto_Produto;
};
