const model = require("../models");

// Função para obter todos os clientes
const obterTodosClientes = async () => {
    return await model.Cliente.findAll();
};

// Função para obter cliente por ID
const obterClientePorEmail = async (cliente) => {
    return await model.Cliente.findByPk(cliente.email);
};

// Função para criar um novo cliente
const criarCliente = async (cliente) => {
    await model.Cliente.create(cliente);
    return cliente;
};

// Função para atualizar um cliente
const atualizarCliente = async (cliente) => {
    try {
        // Atualizar o cliente
        await model.Cliente.update(cliente, { where: { email: cliente.email } });

        // Retornar o cliente atualizado
        return await model.Cliente.findByPk(cliente.email);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um cliente
const deletarCliente = async (cliente) => {
    try {
        // Deletar o cliente
        await model.Cliente.destroy({ where: { email: cliente.email } });
        return cliente;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosClientes,
    obterClientePorEmail,
    criarCliente,
    atualizarCliente,
    deletarCliente,
};
