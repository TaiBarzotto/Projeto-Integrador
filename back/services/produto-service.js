const produtoRepository = require("../repositories/produto-repository");

// Função para retornar todos os produtos
const retornaTodosProdutos = async (req, res) => {
	try {
		const produto = await produtoRepository.obterTodosProdutos();
		res.status(200).json({ produto: produto });
	} catch (error) {
		console.log("Erro ao buscar produto:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todas as categorias de produtos
const retornaTodasCategoriasProdutos = async (req, res) => {
	try {
		const categorias = await produtoRepository.obterTodasCategoriasProdutos();
		res.status(200).json({ categoria: categorias });
	} catch (error) {
		console.log("Erro ao buscar categorias do produto:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todas as informações dos produtos
const retornaTodasInformacoesProduto = async (req, res) => {
	try {
		const produtos = await produtoRepository.obterTodasInformacoesProduto();
		res.status(200).json({ produtos: produtos });
	} catch (error) {
		console.log("Erro ao buscar informações dos produtos:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo produto
const criaProduto = async (req, res) => {
	const { 
		nome, 
		preco_venda, 
		categorias, // Array de IDs de categorias
		variantes   // Array de variantes com fornecedores
	} = req.body;

	try {
		// Validações básicas
		if (!nome || !preco_venda) {
			return res.status(400).json({
				message: "Nome e preço de venda são obrigatórios."
			});
		}

		if (!categorias || categorias.length === 0) {
			return res.status(400).json({
				message: "Pelo menos uma categoria deve ser selecionada."
			});
		}

		if (!variantes || variantes.length === 0) {
			return res.status(400).json({
				message: "Pelo menos uma variante deve ser cadastrada."
			});
		}

		// Criar produto com categorias e variantes
		const produto = await produtoRepository.criarProduto({
			nome,
			preco_venda,
			categorias,
			variantes
		});

		res.status(201).json(produto);
	} catch (error) {
		console.log("Erro ao criar produto:", error);
		res.status(500).json({ 
			message: "Erro ao criar produto",
			error: error.message 
		});
	}
};

// Função para atualizar um produto
const atualizaProduto = async (req, res) => {
	const { 
		nome, 
		preco_venda, 
		categorias, // Array de IDs de categorias
		variantes   // Array de variantes (com ou sem ID)
	} = req.body;

	const id = parseInt(req.params.id);

	try {
		// Validações básicas
		if (!nome || !preco_venda) {
			return res.status(400).json({
				message: "Nome e preço de venda são obrigatórios."
			});
		}

		if (!categorias || categorias.length === 0) {
			return res.status(400).json({
				message: "Pelo menos uma categoria deve ser selecionada."
			});
		}

		const produtoAtualizado = await produtoRepository.atualizarProduto({
			id,
			nome, 
			preco_venda, 
			categorias,
			variantes
		});

		if (produtoAtualizado) {
			res.status(200).json(produtoAtualizado);
		} else {
			res.status(404).json({ message: "Produto não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar produto:", error);
		res.status(500).json({ 
			message: "Erro ao atualizar produto",
			error: error.message 
		});
	}
};

// Função para deletar um produto
const deletaProduto = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const produtoRemovido = await produtoRepository.deletarProduto({ id });

		if (produtoRemovido) {
			res.status(200).json({
				message: "Produto removido com sucesso.",
				produto: produtoRemovido,
			});
		} else {
			res.status(404).json({ message: "Produto não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar produto:", error);
		res.status(500).json({ message: "Erro ao deletar produto" });
	}
};

// Função para buscar produto por ID
const retornaProdutoPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const produto = await produtoRepository.obterProdutoPorId({ id });

		if (produto) {
			res.status(200).json(produto);
		} else {
			res.status(404).json({ message: "Produto não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar produto:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodosProdutos,
	criaProduto,
	atualizaProduto,
	deletaProduto,
	retornaProdutoPorId,
	retornaTodasCategoriasProdutos,
	retornaTodasInformacoesProduto
};