"use strict";
module.exports = (sequelize, DataTypes) => {
  const Variante_Produto_Estoque = sequelize.define(
    "Variante_Produto_Estoque",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      codigo_de_barras: DataTypes.BIGINT,
      tamanho: DataTypes.STRING,
      cor: DataTypes.STRING,
      quantidade_estoque: DataTypes.INTEGER,
      limite_minimo: DataTypes.INTEGER,
      data_cadastro: DataTypes.DATE,
      ativo: DataTypes.BOOLEAN,
      custo: DataTypes.DECIMAL(10, 2),
      fk_produto_id: DataTypes.INTEGER,
    },
    {
      tableName: "variante_produto_estoque",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Variante_Produto_Estoque.associate = (models) => {
    Variante_Produto_Estoque.belongsTo(models.Produto, {
      foreignKey: "fk_produto_id",
      as: "produto",
    });

    Variante_Produto_Estoque.belongsToMany(models.Fornecedor, {
      through: models.Fornecedor_Estoque,
      foreignKey: "fk_estoque_id",
      otherKey: "fk_fornecedor_id",
      as: "fornecedores",
    });

    Variante_Produto_Estoque.hasMany(models.item_venda, {
      foreignKey: "fk_variante_produto_estoque_id",
      as: "itens_venda",
    });
  };

  return Variante_Produto_Estoque;
};
