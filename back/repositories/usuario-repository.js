const model = require("../models");

// Função para obter todos os usuarios
const obterTodosUsuarios = async () => {
    return await model.Usuario.findAll();
};

// Função para obter usuario por ID
const obterUsuarioPorId = async (usuario) => {
    return await model.Usuario.findByPk(usuario.id);
};

// Função para criar um novo usuario
const criarUsuario = async (usuario) => {
    try {
        await model.Usuario.create(usuario);
        return usuario;
    } catch (error) {
        throw error;
    }
};

// Função para atualizar um usuario
const atualizarUsuario = async (usuario) => {
    try {
        // Atualizar o usuario
        await model.Usuario.update(usuario, { where: { id: usuario.id } });

        // Retornar o usuario atualizado
        return await model.Usuario.findByPk(usuario.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um usuario
const deletarUsuario = async (usuario) => {
    try {
        // Deletar o usuario
        await model.Usuario.destroy({ where: { id: usuario.id } });
        return usuario;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosUsuarios,
    obterUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
};
