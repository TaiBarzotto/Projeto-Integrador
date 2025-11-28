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

// Função para criar um novo produto com suas variantes
const criarProduto = async (produto) => {
	try{

		const novoProduto = await model.Produto.create(produto, {
			include: [
				{
					model: model.Variante_Produto_Estoque,
					as: "variantes"
				}
			]
		});
		
		return novoProduto;
	}catch(error){
		throw error;
	}
};

// Função para atualizar um produto
const atualizarProduto = async (dados_produto) => {
	try {
		// Atualizar o produto
		const produto = await model.Produto.findByPk(dados_produto.id)
				
		if (!produto) return null

		// Verifica se é uma nova variação ou atualização de uma variação
		if (dados_produto.variantes && dados_produto.variantes.length > 0) {
            for (const variante of dados_produto.variantes) {
                // UPDATE → se tiver ID
                if (variante.id) {
                    await model.Variante_Produto_Estoque.update(
                        variante,
                        { where: { id: variante.id } }
                    );
                }
                // CREATE → se não tiver ID
                else {
                    await model.Variante_Produto_Estoque.create(
                        { ...variante, fk_produto_id: id }
                    );
                }
            }
        }
		
		// Atualizar produto
		await model.Produto.update(dados_produto, {
			where: { id: dados_produto.id },
		})
		
				
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
