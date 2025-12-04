const express = require("express");
const financeiroService = require("../services/financeiro-service");

const financeiroRouter = express.Router();

/**
 * GET /financeiro/resumo
 * Retorna resumo financeiro completo (totais, lucro, saldo, etc)
 */
financeiroRouter.get("/resumo", financeiroService.obterResumoFinanceiro);

/**
 * GET /financeiro/vendas-despesas-mes
 * Retorna vendas e despesas agrupadas por mês (últimos 6 meses)
 */
financeiroRouter.get("/vendas-despesas-mes", financeiroService.obterVendasDespesasPorMes);

/**
 * GET /financeiro/despesas-categoria
 * Retorna despesas agrupadas por categoria
 */
financeiroRouter.get("/despesas-categoria", financeiroService.obterDespesasPorCategoria);

/**
 * GET /financeiro/produtos-mais-vendidos
 * Retorna os produtos mais vendidos
 * Query params: limite (default: 5)
 */
financeiroRouter.get("/produtos-mais-vendidos", financeiroService.obterProdutosMaisVendidos);

/**
 * GET /financeiro/analise-estoque
 * Retorna análise de estoque (produtos baixos, ideais, etc)
 */
financeiroRouter.get("/analise-estoque", financeiroService.obterAnaliseEstoque);

/**
 * GET /financeiro/contas-pagar
 * Retorna todas as contas a pagar (parcelas de despesas não pagas)
 */
financeiroRouter.get("/contas-pagar", financeiroService.obterContasAPagar);

/**
 * GET /financeiro/contas-receber
 * Retorna todas as contas a receber (parcelas de vendas não pagas)
 */
financeiroRouter.get("/contas-receber", financeiroService.obterContasAReceber);

module.exports = financeiroRouter;