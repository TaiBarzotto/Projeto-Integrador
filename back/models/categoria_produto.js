"use strict";
module.exports = (sequelize, DataTypes) => {
  const Categoria_Produto = sequelize.define(
    "Categoria_Produto",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: DataTypes.STRING,
      descricao: DataTypes.STRING,
    },
    {
      tableName: "categoria_produto",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Categoria_Produto.associate = (models) => {
    Categoria_Produto.belongsToMany(models.Produto, {
      through: models.Categoria_Produto_Produto,
      foreignKey: "fk_categoria_produto_id",
      otherKey: "fk_produto_id",
      as: "produtos",
    });
  };

  return Categoria_Produto;
};
