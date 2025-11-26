"use strict";
module.exports = (sequelize, DataTypes) => {
  const Despesa = sequelize.define(
    "Despesa",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      observacao: DataTypes.STRING,
      valor: DataTypes.DECIMAL(10, 2),
      fk_categoria_despesa: DataTypes.INTEGER,
    },
    {
      tableName: "despesa",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Despesa.associate = (models) => {
    Despesa.belongsTo(models.Categoria_Despesa, {
      foreignKey: "fk_categoria_despesa",
      as: "categoria",
    });

    Despesa.hasMany(models.Parcela_despesa, {
      foreignKey: "fk_despesa_id",
      as: "parcelas",
    });
  };

  return Despesa;
};
