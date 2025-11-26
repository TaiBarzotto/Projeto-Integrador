"use strict";
module.exports = (sequelize, DataTypes) => {
  const Vendas = sequelize.define(
    "Vendas",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      valor_total: DataTypes.DECIMAL(10, 2),
      forma_de_pagamento: DataTypes.STRING,
      desconto: DataTypes.DECIMAL(10, 2),
      data_venda: DataTypes.DATE,
      fk_usuario_email: DataTypes.STRING,
      fk_cliente_email: DataTypes.STRING,
    },
    {
      tableName: "vendas",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Vendas.associate = (models) => {
    Vendas.belongsTo(models.Usuario, {
      foreignKey: "fk_usuario_email",
      as: "usuario",
    });

    Vendas.belongsTo(models.Cliente, {
      foreignKey: "fk_cliente_email",
      as: "cliente",
    });

    Vendas.hasMany(models.Parcela_venda, {
      foreignKey: "fk_vendas_id",
      as: "parcelas",
    });

    Vendas.hasMany(models.item_venda, {
      foreignKey: "fk_vendas_id",
      as: "itens",
    });
  };

  return Vendas;
};
