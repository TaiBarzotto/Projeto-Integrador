const clienteRepository = require("../repositories/cliente-repository");

// Função para retornar todos os clientes
const retornaTodosClientes = async (req, res) => {
    try {
        const clientes = await clienteRepository.obterTodosClientes();
        res.status(200).json({ clientes: clientes });
    } catch (error) {
        console.log("Erro ao buscar clientes:", error);
        res.sendStatus(500);
    }
};

// Função para criar um novo cliente
const criaCliente = async (req, res) => {
    const {nome, email } = req.body;
    console.log({nome, email });
    try {
        if (!nome || !email) {
            return res
                .status(400)
                .json({ message: "Nome e email são obrigatórios." });
        }

        const cliente = await clienteRepository.criarCliente({
            nome,
            email,
        });
        res.status(201).json(cliente);
    } catch (error) {
        console.log("Erro ao criar cliente:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um cliente
const atualizaCliente = async (req, res) => {
    const { nome, email } = req.body;
    const id = parseInt(req.params.id);
    try {
        const clienteAtualizado = await clienteRepository.atualizarCliente({
            id,
            nome,
            email,
        });

        if (clienteAtualizado) {
            res.status(200).json(clienteAtualizado);
        } else {
            res.status(404).json({ message: "cliente não encontrado" });
        }
    } catch (error) {
        console.log("Erro ao atualizar cliente:", error);
        res.sendStatus(500);
    }
};

// Função para deletar um cliente
const deletaCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const clienteRemovido = await clienteRepository.deletarCliente({ id });

        if (clienteRemovido) {
            res.status(200).json({
                message: "cliente removido com sucesso.",
                cliente: clienteRemovido,
            });
        } else {
            res.status(404).json({ message: "cliente não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        res.status(500).json({ message: "Erro ao deletar cliente" });
    }
};

// Função para buscar cliente por ID
const retornaClientePorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cliente = await clienteRepository.obterClientePorEmail({
            id,
        });

        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: "cliente não encontrado." });
        }
    } catch (error) {
        console.log("Erro ao buscar cliente:", error);
        res.sendStatus(500);
    }
};

module.exports = {
    retornaTodosClientes,
    criaCliente,
    atualizaCliente,
    deletaCliente,
    retornaClientePorId,
};
