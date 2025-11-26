"use strict";
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      genero: DataTypes.CHAR,
      telefone: DataTypes.STRING,
      nome: DataTypes.STRING,
      fk_endereco: DataTypes.INTEGER,
      nascimento: DataTypes.DATE,
      aceita_promocoes: DataTypes.BOOLEAN,
    },
    {
      tableName: "cliente",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Cliente.associate = (models) => {
    Cliente.belongsTo(models.Endereco, {
      foreignKey: "fk_endereco",
      sourceKey: "id",
    });

    Cliente.hasMany(models.Vendas, {
      foreignKey: "fk_cliente_email",
      sourceKey: "email",
    });
  };

  return Cliente;
};
