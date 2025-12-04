const express = require("express");
const parcelaVendaService = require("../services/parcela-venda-service");

const parcelaVendaRouter = express.Router();

// POST /parcela-venda - Criar nova parcela
parcelaVendaRouter.post("/", parcelaVendaService.criaParcela);

// GET /parcelas-venda/todos - Retornar todas as parcelas
parcelaVendaRouter.get("/todos", parcelaVendaService.retornaTodasParcelas);

// GET /parcela-venda/:id - Retornar parcela por ID
parcelaVendaRouter.get("/:id", parcelaVendaService.retornaParcelaPorId);

// PUT /parcela-venda/:id - Atualizar parcela
parcelaVendaRouter.put("/:id", parcelaVendaService.atualizaParcela);

// DELETE /parcela-venda/:id - Deletar parcela
parcelaVendaRouter.delete("/:id", parcelaVendaService.deletaParcela);

module.exports = parcelaVendaRouter;
