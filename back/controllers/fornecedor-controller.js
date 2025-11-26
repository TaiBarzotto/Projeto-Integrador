const express = require("express");
const fornecedorService = require("../services/fornecedor-service");

const fornecedorRouter = express.Router();

// POST /fornecedor - Criar novo fornecedor
fornecedorRouter.post("/", fornecedorService.criaFornecedor);

// GET /fornecedores - Retornar todos os fornecedores
fornecedorRouter.get("/todos", fornecedorService.retornaTodosFornecedores);

// GET /fornecedor/:id - Retornar fornecedor por ID
fornecedorRouter.get("/:id", fornecedorService.retornaFornecedorPorId);

// PUT /fornecedor/:id - Atualizar fornecedor
fornecedorRouter.put("/:id", fornecedorService.atualizaFornecedor);

// DELETE /fornecedor/:id - Deletar fornecedor
fornecedorRouter.delete("/:id", fornecedorService.deletaFornecedor);

module.exports = fornecedorRouter;
