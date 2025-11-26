"use strict";
module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define(
    "Produto",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: DataTypes.STRING,
      preco_venda: DataTypes.DECIMAL(10, 2),
    },
    {
      tableName: "produto",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Produto.associate = (models) => {
    Produto.hasMany(models.Variante_Produto_Estoque, {
      foreignKey: "fk_produto_id",
      as: "variantes",
    });

    Produto.belongsToMany(models.Categoria_Produto, {
      through: models.Categoria_Produto_Produto,
      foreignKey: "fk_produto_id",
      otherKey: "fk_categoria_produto_id",
      as: "categorias",
    });
  };

  return Produto;
};
