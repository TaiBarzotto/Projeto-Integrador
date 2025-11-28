const model = require("../models");

// Função para obter todos os fornecedores
const obterTodosFornecedores = async () => {
	return await model.Fornecedor.findAll();
};

// Função para obter fornecedor por ID
const obterFornecedorPorId = async (fornecedor) => {
	return await model.Fornecedor.findByPk(fornecedor.id);
};

// Função para criar um novo fornecedor
const criarFornecedor = async (fornecedor) => {
	try {
		await model.Fornecedor.create(fornecedor);
		return fornecedor;
	} catch (error) {
		throw error;
	}
};

// Função para atualizar um fornecedor
const atualizarFornecedor = async (fornecedor) => {
	try {
		// Atualizar o fornecedor
		await model.Fornecedor.update(fornecedor, { where: { id: fornecedor.id } });

		// Retornar o fornecedor atualizado
		return await model.Fornecedor.findByPk(fornecedor.id);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um fornecedor
const deletarFornecedor = async (fornecedor) => {
	try {
		// Deletar o fornecedor
		await model.Fornecedor.destroy({ where: { id: fornecedor.id } });
		return fornecedor;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosFornecedores,
	obterFornecedorPorId,
	criarFornecedor,
	atualizarFornecedor,
	deletarFornecedor,
};
