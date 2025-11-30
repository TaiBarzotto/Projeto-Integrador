const usuarioRepository = require("../repositories/usuario-repository");

// Função para retornar todos os usuarios
const retornaTodosUsuarios = async (req, res) => {
	try {
		const usuarios = await usuarioRepository.obterTodosUsuarios();
		res.status(200).json({ usuarios: usuarios });
	} catch (error) {
		console.log("Erro ao buscar usuarios:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo usuario
const criaUsuario = async (req, res) => {
	const {
		email,
		nome_pessoa,
		telefone,
		nome_da_marca,
	} = req.body
	try {
		if (!email || !nome_pessoa || !telefone || !nome_da_marca) {
			return res
				.status(400)
				.json({ message: "Nome e email são obrigatórios." });
		}

		const usuario = await usuarioRepository.criarUsuario({
			email,
			nome_pessoa,
			telefone,
			nome_da_marca,
		});
		res.status(201).json(usuario);
	} catch (error) {
		console.log("Erro ao criar usuario:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um usuario
const atualizaUsuario = async (req, res) => {
	const {
		email,
		nome_pessoa,
		telefone,
		nome_da_marca,
	} = req.body
	const id = parseInt(req.params.id);
	try {
		const usuarioAtualizado = await usuarioRepository.atualizarUsuario({
			id,
			email,
			nome_pessoa,
			telefone,
			nome_da_marca,
		});

		if (usuarioAtualizado) {
			res.status(200).json(usuarioAtualizado);
		} else {
			res.status(404).json({ message: "Usuario não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar usuario:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um usuario
const deletaUsuario = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const usuarioRemovido = await usuarioRepository.deletarUsuario({ id });

		if (usuarioRemovido) {
			res.status(200).json({
				message: "Usuario removido com sucesso.",
				usuario: usuarioRemovido,
			});
		} else {
			res.status(404).json({ message: "Usuario não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar usuario:", error);
		if (error.name === "SequelizeForeignKeyConstraintError") {
			return res.status(409).json({
				message: "Usuario não pode ser deletado pois está atrelado a um produto"
			});
		}

		// Erro geral 
		res.status(500).json({ message: "Erro ao deletar usuario" });
	}
};

// Função para buscar usuario por ID
const retornaUsuarioPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const usuario = await usuarioRepository.obterUsuarioPorId({
			id,
		});

		if (usuario) {
			res.status(200).json(usuario);
		} else {
			res.status(404).json({ message: "Usuario não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar usuario:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodosUsuarios,
	criaUsuario,
	atualizaUsuario,
	deletaUsuario,
	retornaUsuarioPorId,
};
