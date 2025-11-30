const express = require("express");
const usuarioService = require("../services/usuario-service");

const usuarioRouter = express.Router();

// POST /usuario - Criar novo usuario
usuarioRouter.post("/", usuarioService.criaUsuario);

// GET /usuarios - Retornar todos os usuarios
usuarioRouter.get("/todos", usuarioService.retornaTodosUsuarios);

// GET /usuario/:id - Retornar usuario por ID
usuarioRouter.get("/:id", usuarioService.retornaUsuarioPorId);

// PUT /usuario/:id - Atualizar usuario
usuarioRouter.put("/:id", usuarioService.atualizaUsuario);

// DELETE /usuario/:id - Deletar usuario
usuarioRouter.delete("/:id", usuarioService.deletaUsuario);

module.exports = usuarioRouter;
