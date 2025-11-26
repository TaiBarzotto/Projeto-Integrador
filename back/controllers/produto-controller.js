const express = require("express");
const produtoService = require("../services/produto-service");

const produtoRouter = express.Router();

// POST /produto - Criar novo produto
produtoRouter.post("/", produtoService.criaProduto);

// GET /produtos - Retornar todos os produtos
produtoRouter.get("/todos", produtoService.retornaTodosProdutos);

// GET /produto/:id - Retornar produto por ID
produtoRouter.get("/:id", produtoService.retornaProdutoPorId);

// PUT /produto/:id - Atualizar produto
produtoRouter.put("/:id", produtoService.atualizaProduto);

// DELETE /produto/:id - Deletar produto
produtoRouter.delete("/:id", produtoService.deletaProduto);

module.exports = produtoRouter;
