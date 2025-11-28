const produtoRepository = require("../repositories/produto-repository");

// Função para retornar todos os produto
const retornaTodosProdutos = async (req, res) => {
	try {
		const produto = await produtoRepository.obterTodosProdutos();
		res.status(200).json({ produto: produto });
	} catch (error) {
		console.log("Erro ao buscar produto:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo produto
const criaProduto = async (req, res) => {
	const { 
		nome, 
		preco_venda, 
		variantes 
    } = req.body;

	try {
		if (!nome || !preco_venda || !variantes) {
            return res.status(400).json({
                message: "Nome, preço de venda e variantes são obrigatórios."
            });
        }

        const produto = await produtoRepository.criarProduto({
            nome,
            preco_venda,
            variantes: variantes
        });
		res.status(201).json(produto);
	} catch (error) {
		console.log("Erro ao criar produto:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um produto
const atualizaProduto = async (req, res) => {
	const { 
		nome, 
		preco_venda, 
		variantes 
    } = req.body;

	const id = parseInt(req.params.id);
	try {
		const produtoAtualizado = await produtoRepository.atualizarProduto({
			id,
			nome, 
			preco_venda, 
			variantes,
		});

		if (produtoAtualizado) {
			res.status(200).json(produtoAtualizado);
		} else {
			res.status(404).json({ message: "produto não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar produto:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um produto
const deletaProduto = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const produtoRemovido = await produtoRepository.deletarProduto({ id });

		if (produtoRemovido) {
			res.status(200).json({
				message: "produto removido com sucesso.",
				produto: produtoRemovido,
			});
		} else {
			res.status(404).json({ message: "produto não encontrado" });
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
		const produto = await produtoRepository.obterProdutoPorId({
			id,
		});

		if (produto) {
			res.status(200).json(produto);
		} else {
			res.status(404).json({ message: "produto não encontrado." });
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
};
