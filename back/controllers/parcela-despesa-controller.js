const express = require("express");
const parcelaService = require("../services/parcela-despesa-service");

const parcelaRouter = express.Router();

// POST /parcela - Criar nova parcela
parcelaRouter.post("/", parcelaService.criaParcela);

// GET /parcelas - Retornar todas as parcelas
parcelaRouter.get("/todos", parcelaService.retornaTodasParcelas);

// GET /parcela/:id - Retornar parcela por ID
parcelaRouter.get("/:id", parcelaService.retornaParcelaPorId);

// PUT /parcela/:id - Atualizar parcela
parcelaRouter.put("/:id", parcelaService.atualizaParcela);

// DELETE /parcela/:id - Deletar parcela
parcelaRouter.delete("/:id", parcelaService.deletaParcela);

module.exports = parcelaRouter;
