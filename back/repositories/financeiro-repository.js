const model = require("../models");

//Obter vendas e despesas por mês (últimos 6 meses)
//Usa SQL pois essa consulta havia sido criada para a disciplina de BD-I
const obterVendasDespesasPorMes = async () => {
  const resultado = await model.sequelize.query(`
    SELECT 
      'D' AS categoria,
      SUM(pd.valor_parcela) AS total_mensal,
      CONCAT(
        EXTRACT(MONTH FROM pd.data_pagamento), 
        '/', 
        EXTRACT(YEAR FROM pd.data_pagamento)
      ) AS mes_ano,
      EXTRACT(YEAR FROM pd.data_pagamento) AS ano,
      EXTRACT(MONTH FROM pd.data_pagamento) AS mes
    FROM 
      despesa d
    JOIN 
      parcela_despesa pd 
        ON pd.fk_despesa_id = d.id
    WHERE 
      pd.data_pagamento IS NOT NULL
      AND pd.data_pagamento >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY 
      ano,
      mes,
      mes_ano
    
    UNION ALL
    
    SELECT
      'V' AS categoria,
      SUM(pv.valor_parcela) AS total_mensal,
      CONCAT(
        EXTRACT(MONTH FROM pv.data_pagamento),
        '/',
        EXTRACT(YEAR FROM pv.data_pagamento)
      ) AS mes_ano,
      EXTRACT(YEAR FROM pv.data_pagamento) AS ano,
      EXTRACT(MONTH FROM pv.data_pagamento) AS mes
    FROM 
      vendas v
    JOIN 
      parcela_venda pv 
        ON pv.fk_vendas_id = v.id
    WHERE 
      pv.data_pagamento IS NOT NULL
      AND pv.data_pagamento >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY
      ano,
      mes,
      mes_ano
    
    ORDER BY
      ano DESC,
      mes DESC,
      categoria
  `, {
    type: model.sequelize.QueryTypes.SELECT
  });

  return resultado;
};

//Obter resumo financeiro
const obterResumoFinanceiro = async () => {
  // Total de vendas
  const totalVendas = await model.sequelize.query(`
    SELECT COALESCE(SUM(pv.valor_parcela), 0) as total
    FROM vendas v
    join parcela_venda pv 
    on pv.fk_vendas_id = v.id
    where pv.pago = true
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  // Total de despesas
  const totalDespesas = await model.sequelize.query(`
    SELECT COALESCE(SUM(pd.valor_parcela), 0) as total
    FROM despesa d
    join parcela_despesa pd 
    on pd.fk_despesa_id = d.id
    where pd.pago = true
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  // Vendas não recebidas
  const totalAReceber = await model.sequelize.query(`
    SELECT COALESCE(SUM(valor_parcela), 0) as total
    FROM parcela_venda
    WHERE pago = false
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  // Despesas não pagas
  const totalAPagar = await model.sequelize.query(`
    SELECT COALESCE(SUM(valor_parcela), 0) as total
    FROM parcela_despesa
    WHERE pago = false
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  // Vendas hoje
  const vendasHoje = await model.sequelize.query(`
      SELECT COALESCE(SUM(pv.valor_parcela), 0) as total
      FROM parcela_venda pv
      WHERE DATE(pv.data_pagamento) = CURRENT_DATE
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  // Despesas hoje
  const despesasHoje = await model.sequelize.query(`
    SELECT COALESCE(SUM(pd.valor_parcela), 0) as total
    FROM parcela_despesa pd
    WHERE DATE(pd.data_pagamento) = CURRENT_DATE
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  // Quantidade de vendas
  const quantidadeVendas = await model.sequelize.query(`
    SELECT COUNT(*) as total
    FROM vendas
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  // Quantidade de despesas
  const quantidadeDespesas = await model.sequelize.query(`
    SELECT COUNT(*) as total
    FROM despesa
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  const totalVendasFloat = parseFloat(totalVendas.total);
  const totalDespesasFloat = parseFloat(totalDespesas.total);
  const lucro = totalVendasFloat - totalDespesasFloat;
  const margemLucro = totalVendasFloat > 0 ? ((lucro / totalVendasFloat) * 100).toFixed(1) : 0;

  return {
    totalVendas: totalVendasFloat,
    totalDespesas: totalDespesasFloat,
    lucro,
    margemLucro: parseFloat(margemLucro),
    totalAReceber: parseFloat(totalAReceber.total),
    totalAPagar: parseFloat(totalAPagar.total),
    vendasHoje: parseFloat(vendasHoje.total),
    despesasHoje: parseFloat(despesasHoje.total),
    saldoHoje: parseFloat(vendasHoje.total) - parseFloat(despesasHoje.total),
    quantidadeVendas: parseInt(quantidadeVendas.total),
    quantidadeDespesas: parseInt(quantidadeDespesas.total),
    ticketMedio: totalVendasFloat / (parseInt(quantidadeVendas.total) || 1),
  };
};

/**
 * Obter análise de estoque
 */
const obterAnaliseEstoque = async () => {
  const produtosBaixoEstoque = await model.sequelize.query(`
    SELECT COUNT(DISTINCT p.id) as total
    FROM produto p
    JOIN variante_produto_estoque v ON v.fk_produto_id = p.id
    WHERE v.quantidade_estoque < v.limite_minimo
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  const totalProdutos = await model.sequelize.query(`
    SELECT COUNT(DISTINCT id) as total
    FROM produto
  `, {
    type: model.sequelize.QueryTypes.SELECT,
    plain: true
  });

  return {
    produtosBaixoEstoque: parseInt(produtosBaixoEstoque.total),
    produtosEstoqueIdeal: parseInt(totalProdutos.total) - parseInt(produtosBaixoEstoque.total),
    totalProdutos: parseInt(totalProdutos.total),
  };
};

module.exports = {
  obterVendasDespesasPorMes,
  obterResumoFinanceiro,
  obterAnaliseEstoque,
};