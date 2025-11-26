"use strict";
module.exports = (sequelize, DataTypes) => {
  const Caixa = sequelize.define(
    "Caixa",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      data: DataTypes.DATE,
      saldo_inicial: DataTypes.DECIMAL(10, 2),
      total_entradas: DataTypes.DECIMAL(10, 2),
      total_saidas: DataTypes.DECIMAL(10, 2),
      saldo_final: DataTypes.DECIMAL(10, 2),
    },
    {
      tableName: "caixa",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

   return Caixa;
};
