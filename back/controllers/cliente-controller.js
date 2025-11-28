const express = require("express");
const clienteService = require("../services/cliente-service");

const clienteRouter = express.Router();

// POST /cliente - Criar novo cliente
clienteRouter.post("/", clienteService.criaCliente);

// GET /clientes - Retornar todos os clientes
clienteRouter.get("/todos", clienteService.retornaTodosClientes);

// GET /cliente/:email - Retornar cliente por email
clienteRouter.get("/:email", clienteService.retornaClientePorEmail);

// PUT /cliente/ - Atualizar cliente
clienteRouter.put("/", clienteService.atualizaCliente);

// DELETE /cliente/ - Deletar cliente
clienteRouter.delete("/", clienteService.deletaCliente);

module.exports = clienteRouter;
