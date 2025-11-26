"use strict";
module.exports = (sequelize, DataTypes) => {
  const Alertas = sequelize.define(
    "Alertas",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      texto: DataTypes.STRING,
      resolvido: DataTypes.BOOLEAN,
      fk_padrao_texto_id: DataTypes.INTEGER,
    },
    {
      tableName: "alertas",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Alertas.associate = (models) => {
    Alertas.belongsTo(models.Padrao_Texto, {
      foreignKey: "fk_padrao_texto_id",
      as: "padrao",
      onDelete: "CASCADE",
    });
  };

  return Alertas;
};
