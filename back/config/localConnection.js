const { Sequelize } = require("sequelize");
// 1114 is OID for timestamp in Postgres
// pgp.pg.types.setTypeParser(1114, (str) => str);

const cls = require("cls-hooked");
const transactionNamespace = cls.createNamespace("transaction_namespace");

Sequelize.useCLS(transactionNamespace);

const sequelize = new Sequelize({
	host: "localhost",
	port: "5433",
	database: "integrador",
	username: "postgres",
	password: "0000",
	schema: "public",
	dialect: "postgres",
	freezeTableName: false,
	syncOnAssociation: false,
	logging: console.log,
	define: {
		freezeTableName: true,
		timestamps: false,
	},
});

module.exports = sequelize;
