const model = require("../models");

const obterTodosProdutos = async () => {
	return await model.Produto.findAll({
		include: [
			{
				model: model.Variante_Produto_Estoque,
				as: "variantes",
			},
		],
	});
};

const obterTodasCategoriasProdutos = async () => {
	return await model.Categoria_Produto.findAll();
};

const obterTodasInformacoesProduto = async () => {
	return await model.Produto.findAll({
		include: [
			{
				model: model.Categoria_Produto,
				as: "categorias",
				through: { attributes: [] },
			},
			{
				model: model.Variante_Produto_Estoque,
				as: "variantes",
				include: [
					{
						model: model.Fornecedor,
						as: "fornecedores",
						through: { attributes: [] }
					}
				]
			}
		],
	});
};

// Função para obter produto por ID com todas as informações
const obterProdutoPorId = async (produto) => {
	return await model.Produto.findByPk(produto.id, {
		include: [
			{
				model: model.Categoria_Produto,
				as: "categorias",
				through: { attributes: [] },
			},
			{
				model: model.Variante_Produto_Estoque,
				as: "variantes",
				include: [
					{
						model: model.Fornecedor,
						as: "fornecedores",
						through: { attributes: [] }
					}
				]
			}
		],
	});
};

// Função para criar um novo produto com categorias, variantes e fornecedores
const criarProduto = async (dadosProduto) => {
	const transaction = await model.sequelize.transaction();

	try {
		// 1. Criar o produto
		const novoProduto = await model.Produto.create({
			nome: dadosProduto.nome,
			preco_venda: dadosProduto.preco_venda
		}, { transaction });

		// 2. Associar categorias ao produto
		if (dadosProduto.categorias && dadosProduto.categorias.length > 0) {
			await novoProduto.setCategorias(dadosProduto.categorias, { transaction });
		}

		// 3. Criar variantes e associar fornecedores
		if (dadosProduto.variantes && dadosProduto.variantes.length > 0) {
			for (const varianteData of dadosProduto.variantes) {
				// Extrair IDs dos fornecedores
				const fornecedorIds = varianteData.fornecedores 
					? varianteData.fornecedores.map(f => f.id || f)
					: [];

				// Criar a variante
				const novaVariante = await model.Variante_Produto_Estoque.create({
					codigo_de_barras: varianteData.codigo_de_barras,
					tamanho: varianteData.tamanho,
					cor: varianteData.cor,
					quantidade_estoque: varianteData.quantidade_estoque || 0,
					limite_minimo: varianteData.limite_minimo || 0,
					data_cadastro: varianteData.data_cadastro || new Date(),
					ativo: varianteData.ativo !== undefined ? varianteData.ativo : true,
					custo: varianteData.custo || null,
					fk_produto_id: novoProduto.id
				}, { transaction });

				// Associar fornecedores à variante
				if (fornecedorIds.length > 0) {
					await novaVariante.setFornecedores(fornecedorIds, { transaction });
				}
			}
		}

		await transaction.commit();

		// Retornar produto completo com todas as associações
		return await obterProdutoPorId({ id: novoProduto.id });

	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

// Função para atualizar um produto
const atualizarProduto = async (dadosProduto) => {
	const transaction = await model.sequelize.transaction();

	try {
		// 1. Buscar o produto
		const produto = await model.Produto.findByPk(dadosProduto.id);

		if (!produto) {
			await transaction.rollback();
			return null;
		}

		// 2. Atualizar dados básicos do produto
		await produto.update({
			nome: dadosProduto.nome,
			preco_venda: dadosProduto.preco_venda
		}, { transaction });

		// 3. Atualizar categorias (substituir todas)
		if (dadosProduto.categorias && dadosProduto.categorias.length > 0) {
			await produto.setCategorias(dadosProduto.categorias, { transaction });
		}

		// 4. Atualizar variantes
		if (dadosProduto.variantes && dadosProduto.variantes.length > 0) {
			// Obter IDs das variantes que estão sendo enviadas (variantes existentes)
			const variantesEnviadasIds = dadosProduto.variantes
				.filter(v => v.id)
				.map(v => v.id);

			// Deletar variantes que não estão mais na lista
			await model.Variante_Produto_Estoque.destroy({
				where: {
					fk_produto_id: dadosProduto.id,
					id: {
						[model.Sequelize.Op.notIn]: variantesEnviadasIds.length > 0 
							? variantesEnviadasIds 
							: [0] 
					}
				},
				transaction
			});

			// Processar cada variante
			for (const varianteData of dadosProduto.variantes) {
				const fornecedorIds = varianteData.fornecedores 
					? varianteData.fornecedores.map(f => f.id || f)
					: [];

				if (varianteData.id) {
					// UPDATE: Variante existente
					const varianteExistente = await model.Variante_Produto_Estoque.findByPk(
						varianteData.id,
						{ transaction }
					);

					if (varianteExistente) {
						await varianteExistente.update({
							codigo_de_barras: varianteData.codigo_de_barras,
							tamanho: varianteData.tamanho,
							cor: varianteData.cor,
							quantidade_estoque: varianteData.quantidade_estoque || 0,
							limite_minimo: varianteData.limite_minimo || 0,
							ativo: varianteData.ativo !== undefined ? varianteData.ativo : true,
							custo: varianteData.custo || null
						}, { transaction });

						// Atualizar fornecedores da variante
						await varianteExistente.setFornecedores(fornecedorIds, { transaction });
					}
				} else {
					// CREATE: Nova variante
					const novaVariante = await model.Variante_Produto_Estoque.create({
						codigo_de_barras: varianteData.codigo_de_barras,
						tamanho: varianteData.tamanho,
						cor: varianteData.cor,
						quantidade_estoque: varianteData.quantidade_estoque || 0,
						limite_minimo: varianteData.limite_minimo || 0,
						data_cadastro: varianteData.data_cadastro || new Date(),
						ativo: varianteData.ativo !== undefined ? varianteData.ativo : true,
						custo: varianteData.custo || null,
						fk_produto_id: dadosProduto.id
					}, { transaction });

					// Associar fornecedores
					if (fornecedorIds.length > 0) {
						await novaVariante.setFornecedores(fornecedorIds, { transaction });
					}
				}
			}
		}

		await transaction.commit();

		// Retornar produto atualizado com todas as associações
		return await obterProdutoPorId({ id: dadosProduto.id });

	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

// Função para deletar um produto
const deletarProduto = async (produto) => {
	try {
		// O Sequelize vai deletar automaticamente as variantes se houver CASCADE
		// Caso contrário, você pode deletar manualmente aqui
		await model.Produto.destroy({ where: { id: produto.id } });

		return produto;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosProdutos,
	obterTodasCategoriasProdutos,
	obterTodasInformacoesProduto,
	obterProdutoPorId,
	criarProduto,
	atualizarProduto,
	deletarProduto,
};