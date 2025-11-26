"use strict";
module.exports = (sequelize, DataTypes) => {
  const Datas_Importantes = sequelize.define(
    "Datas_Importantes",
    {
      data: {
        type: DataTypes.DATE,
        primaryKey: true,
      },
      descricao: DataTypes.STRING,
      dias_antecedencia_alerta: DataTypes.INTEGER,
    },
    {
      tableName: "datas_importantes",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Datas_Importantes;
};
