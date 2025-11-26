const model = require("../models");

const obterTodosProdutos = async () => {
	return await model.Produto.findAll({
		include:[
			{
				model: model.Variante_Produto_Estoque,
				as: 'variantes'
			}
		]
	});
};

// Função para obter produto por ID
const obterProdutoPorId = async (produto) => {
	return await model.Produto.findByPk(produto.id);
};

// Função para criar um novo produto
const criarProduto = async (produto) => {
	await model.Produto.create(produto);
	return produto;
};

// Função para atualizar um produto
const atualizarProduto = async (produto) => {
	try {
		// Atualizar o produto
		await model.Produto.update(produto, { where: { id: produto.id } });

		// Retornar o produto atualizado
		return await model.Produto.findByPk(produto.id);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um produto
const deletarProduto = async (produto) => {
	try {
		// Deletar o produto
		await model.Produto.destroy({ where: { id: produto.id } });

		return produto;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosProdutos,
	obterProdutoPorId,
	criarProduto,
	atualizarProduto,
	deletarProduto,
};
