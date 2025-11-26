const fornecedorRepository = require("../repositories/fornecedor-repository");

// Função para retornar todos os fornecedores
const retornaTodosFornecedores = async (req, res) => {
	try {
		const fornecedores = await fornecedorRepository.obterTodosFornecedores();
		res.status(200).json({ fornecedores: fornecedores });
	} catch (error) {
		console.log("Erro ao buscar fornecedores:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo fornecedor
const criaFornecedor = async (req, res) => {
	const {nome, email } = req.body;
	console.log({nome, email });
	try {
		if (!nome || !email) {
			return res
				.status(400)
				.json({ message: "Nome e email são obrigatórios." });
		}

		const fornecedor = await fornecedorRepository.criarFornecedor({
			nome,
			email,
		});
		res.status(201).json(fornecedor);
	} catch (error) {
		console.log("Erro ao criar fornecedor:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um fornecedor
const atualizaFornecedor = async (req, res) => {
	const { nome, email } = req.body;
	const id = parseInt(req.params.id);
	try {
		const fornecedorAtualizado = await fornecedorRepository.atualizarFornecedor({
			id,
			nome,
			email,
		});

		if (fornecedorAtualizado) {
			res.status(200).json(fornecedorAtualizado);
		} else {
			res.status(404).json({ message: "Fornecedor não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar fornecedor:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um fornecedor
const deletaFornecedor = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const fornecedorRemovido = await fornecedorRepository.deletarFornecedor({ id });

		if (fornecedorRemovido) {
			res.status(200).json({
				message: "Fornecedor removido com sucesso.",
				fornecedor: fornecedorRemovido,
			});
		} else {
			res.status(404).json({ message: "Fornecedor não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar fornecedor:", error);
		res.status(500).json({ message: "Erro ao deletar fornecedor" });
	}
};

// Função para buscar fornecedor por ID
const retornaFornecedorPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const fornecedor = await fornecedorRepository.obterFornecedorPorId({
			id,
		});

		if (fornecedor) {
			res.status(200).json(fornecedor);
		} else {
			res.status(404).json({ message: "Fornecedor não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar fornecedor:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodosFornecedores,
	criaFornecedor,
	atualizaFornecedor,
	deletaFornecedor,
	retornaFornecedorPorId,
};
