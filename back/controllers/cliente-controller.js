const express = require("express");
const clienteService = require("../services/cliente-service");

const clienteRouter = express.Router();

// POST /cliente - Criar novo cliente
clienteRouter.post("/", clienteService.criaCliente);

// GET /clientes - Retornar todos os clientes
clienteRouter.get("/todos", clienteService.retornaTodosClientes);

// GET /cliente/:id - Retornar cliente por ID
clienteRouter.get("/:id", clienteService.retornaClientePorId);

// PUT /cliente/:id - Atualizar cliente
clienteRouter.put("/:id", clienteService.atualizaCliente);

// DELETE /cliente/:id - Deletar cliente
clienteRouter.delete("/:id", clienteService.deletaCliente);

module.exports = clienteRouter;
