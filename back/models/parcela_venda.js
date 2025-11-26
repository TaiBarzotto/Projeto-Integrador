"use strict";
module.exports = (sequelize, DataTypes) => {
  const Parcela_venda = sequelize.define(
    "Parcela_venda",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      numero_parcela: DataTypes.INTEGER,
      valor_parcela: DataTypes.DECIMAL(10, 2),
      data_vencimento: DataTypes.DATE,
      pago: DataTypes.BOOLEAN,
      data_pagamento: DataTypes.DATE,
      fk_vendas_id: DataTypes.INTEGER,
    },
    {
      tableName: "parcela_venda",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Parcela_venda.associate = (models) => {
    Parcela_venda.belongsTo(models.Vendas, {
      foreignKey: "fk_vendas_id",
      as: "venda",
      onDelete: "CASCADE",
    });
  };

  return Parcela_venda;
};
