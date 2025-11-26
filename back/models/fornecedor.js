"use strict";
module.exports = (sequelize, DataTypes) => {
  const Fornecedor = sequelize.define(
    "Fornecedor",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      nome_pessoa: DataTypes.STRING,
      telefone: DataTypes.STRING,
      nome_da_marca: DataTypes.STRING,
    },
    {
      tableName: "fornecedor",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Fornecedor.associate = (models) => {
    Fornecedor.belongsToMany(models.Variante_Produto_Estoque, {
      through: models.Fornecedor_Estoque,
      foreignKey: "fk_fornecedor_id",
      otherKey: "fk_estoque_id",
      as: "estoques",
    });
  };

  return Fornecedor;
};
