"use strict";
module.exports = (sequelize, DataTypes) => {
  const item_venda = sequelize.define(
    "item_venda",
    {
      fk_variante_produto_estoque_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      fk_vendas_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      preco_unitario: DataTypes.DECIMAL(10, 2),
      subtotal: DataTypes.DECIMAL(10, 2),
      quantidade: DataTypes.INTEGER,
    },
    {
      tableName: "item_venda",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  item_venda.associate = (models) => {
    item_venda.belongsTo(models.Variante_Produto_Estoque, {
      foreignKey: "fk_variante_produto_estoque_id",
      as: "variante",
    });

    item_venda.belongsTo(models.Vendas, {
      foreignKey: "fk_vendas_id",
      as: "venda",
    });
  };

  return item_venda;
};
