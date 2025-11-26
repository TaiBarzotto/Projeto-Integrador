"use strict";
module.exports = (sequelize, DataTypes) => {
  const Parcela_despesa = sequelize.define(
    "Parcela_despesa",
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
      fk_despesa_id: DataTypes.INTEGER,
    },
    {
      tableName: "parcela_despesa",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Parcela_despesa.associate = (models) => {
    Parcela_despesa.belongsTo(models.Despesa, {
      foreignKey: "fk_despesa_id",
      as: "despesa",
    });
  };

  return Parcela_despesa;
};
