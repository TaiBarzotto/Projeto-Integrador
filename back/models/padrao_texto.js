"use strict";
module.exports = (sequelize, DataTypes) => {
  const Padrao_Texto = sequelize.define(
    "Padrao_Texto",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      texto_padrao: DataTypes.STRING,
    },
    {
      tableName: "padrao_texto",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Padrao_Texto.associate = (models) => {
    Padrao_Texto.hasMany(models.Alertas, {
      foreignKey: "fk_padrao_texto_id",
      as: "alertas",
    });
  };

  return Padrao_Texto;
};
