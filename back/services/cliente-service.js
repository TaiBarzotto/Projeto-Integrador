const clienteRepository = require("../repositories/cliente-repository")

// Função para retornar todos os clientes
const retornaTodosClientes = async (req, res) => {
    try {
        const clientes = await clienteRepository.obterTodosClientes()
        res.status(200).json({ clientes: clientes })
    } catch (error) {
        console.log("Erro ao buscar clientes:", error)
        res.sendStatus(500)
    }
}

// Função para criar um novo cliente
const criaCliente = async (req, res) => {
    try {
        const {
            email,
            nome,
            telefone,
            genero,
            nascimento,
            aceita_promocoes,
            endereco,
        } = req.body

        if (!email || !nome || !telefone || !genero || !nascimento || !aceita_promocoes || !endereco ) {
            return res
                .status(400)
                .json({ message: "Nome e email são obrigatórios." })
        }

        const novoCliente = await clienteRepository.criarCliente(
            {
                email,
                nome,
                telefone,
                genero,
                nascimento,
                aceita_promocoes,
            },
            endereco,
        )

        return res.status(201).json(novoCliente)
    } catch (error) {
        console.error("Erro ao criar cliente:", error)
        return res.status(500).json({ message: "Erro ao criar cliente." })
    }
}

// Função para atualizar um cliente
const atualizaCliente = async (req, res) => {
    try {
        const {
            email,
            nome,
            telefone,
            genero,
            nascimento,
            aceita_promocoes,
            endereco,
        } = req.body

        const clienteAtualizado = await clienteRepository.atualizarCliente({
            email,
            nome,
            telefone,
            genero,
            nascimento,
            aceita_promocoes,
            endereco,
        })

        if (clienteAtualizado) {
            res.status(200).json(clienteAtualizado)
        } else {
            res.status(404).json({ message: "cliente não encontrado" })
        }
    } catch (error) {
        console.log("Erro ao atualizar cliente:", error)
        res.sendStatus(500)
    }
}

// Função para deletar um cliente
const deletaCliente = async (req, res) => {
    try {
        const email = req.params.email
        const clienteRemovido = await clienteRepository.deletarCliente({ email })

        if (clienteRemovido) {
            res.status(200).json({
                message: "cliente removido com sucesso.",
                cliente: clienteRemovido,
            })
        } else {
            res.status(404).json({ message: "cliente não encontrado" })
        }
    } catch (error) {
        console.error("Erro ao deletar cliente:", error)
        res.status(500).json({ message: "Erro ao deletar cliente" })
    }
}

// Função para buscar cliente por Email
const retornaClientePorEmail = async (req, res) => {
    try {
        const email = parseInt(req.params.Email)
        const cliente = await clienteRepository.obterClientePorEmail({
            email,
        })

        if (cliente) {
            res.status(200).json(cliente)
        } else {
            res.status(404).json({ message: "cliente não encontrado." })
        }
    } catch (error) {
        console.log("Erro ao buscar cliente:", error)
        res.sendStatus(500)
    }
}

module.exports = {
    retornaTodosClientes,
    criaCliente,
    atualizaCliente,
    deletaCliente,
    retornaClientePorEmail,
}
