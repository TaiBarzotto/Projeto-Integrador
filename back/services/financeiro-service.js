const financeiroRepository = require("../repositories/financeiro-repository");
const despesaRepository = require("../repositories/despesa-repository");
const vendasRepository = require("../repositories/vendas-repository");

/**
 * Retorna o resumo financeiro completo
 */
const obterResumoFinanceiro = async (req, res) => {
  try {
    const resumo = await financeiroRepository.obterResumoFinanceiro();
    res.status(200).json(resumo);
  } catch (error) {
    console.error("Erro ao buscar resumo financeiro:", error);
    res.status(500).json({ 
      message: "Erro ao buscar resumo financeiro",
      error: error.message 
    });
  }
};

/**
 * Retorna vendas e despesas por mês
 */
const obterVendasDespesasPorMes = async (req, res) => {
  try {
    const dados = await financeiroRepository.obterVendasDespesasPorMes();
    
    // Processar dados para formato mais amigável
    const resultado = {};
    
    dados.forEach(item => {
      if (!resultado[item.mes_ano]) {
        resultado[item.mes_ano] = {
          mes_ano: item.mes_ano,
          mes: item.mes,
          ano: item.ano,
          vendas: 0,
          despesas: 0
        };
      }
      
      if (item.categoria === 'V') {
        resultado[item.mes_ano].vendas = parseFloat(item.total_mensal);
      } else if (item.categoria === 'D') {
        resultado[item.mes_ano].despesas = parseFloat(item.total_mensal);
      }
    });
    
    // Converter objeto para array e ordenar
    const array = Object.values(resultado).sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    });
    
    res.status(200).json(array);
  } catch (error) {
    console.error("Erro ao buscar vendas e despesas por mês:", error);
    res.status(500).json({ 
      message: "Erro ao buscar dados",
      error: error.message 
    });
  }
};

/**
 * Retorna despesas por categoria
 */
const obterDespesasPorCategoria = async (req, res) => {
  try {
    const despesas = await despesaRepository.obterDespesasConsolidadasPorCategoria();
    
    // Formatar dados
    const resultado = despesas.map(item => ({
      nome: item['categoria.nome'],
      descricao: item['categoria.descricao'],
      valor: parseFloat(item.total_despesas),
      // Gerar cor aleatória para o gráfico
      cor: '#' + Math.floor(Math.random() * 16777215).toString(16)
    }));
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar despesas por categoria:", error);
    res.status(500).json({ 
      message: "Erro ao buscar despesas por categoria",
      error: error.message 
    });
  }
};

/**
 * Retorna produtos mais vendidos
 */
const obterProdutosMaisVendidos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    const produtos = await vendasRepository.obterProdutosMaisVendidos(limite);
    
    // Formatar dados - agora os dados já vêm do SQL raw formatados
    const resultado = produtos.map(item => ({
      id: item.produto_id,
      nome: item.produto_nome,
      vendas: parseInt(item.total_vendido)
    }));
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar produtos mais vendidos:", error);
    res.status(500).json({ 
      message: "Erro ao buscar produtos mais vendidos",
      error: error.message 
    });
  }
};

/**
 * Retorna análise de estoque
 */
const obterAnaliseEstoque = async (req, res) => {
  try {
    const analise = await financeiroRepository.obterAnaliseEstoque();
    res.status(200).json(analise);
  } catch (error) {
    console.error("Erro ao buscar análise de estoque:", error);
    res.status(500).json({ 
      message: "Erro ao buscar análise de estoque",
      error: error.message 
    });
  }
};

/**
 * Retorna contas a pagar
 */
const obterContasAPagar = async (req, res) => {
  try {
    const despesas = await despesaRepository.obterDespesasNaoPagas();
    
    // Formatar dados
    const resultado = despesas.flatMap(despesa => 
      despesa.parcelas
        .filter(parcela => !parcela.pago)
        .map(parcela => ({
          despesaId: despesa.id,
          descricao: despesa.observacao,
          categoria: despesa.categoria?.nome || 'Sem categoria',
          numeroParcela: parcela.numero_parcela,
          totalParcelas: despesa.parcelas.length,
          valor: parseFloat(parcela.valor_parcela),
          dataVencimento: parcela.data_vencimento,
          pago: parcela.pago
        }))
    );
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar contas a pagar:", error);
    res.status(500).json({ 
      message: "Erro ao buscar contas a pagar",
      error: error.message 
    });
  }
};

/**
 * Retorna contas a receber
 */
const obterContasAReceber = async (req, res) => {
  try {
    const vendas = await vendasRepository.obterVendasNaoRecebidas();
    
    // Formatar dados
    const resultado = vendas.flatMap(venda => 
      venda.parcelas
        .filter(parcela => !parcela.pago)
        .map(parcela => ({
          vendaId: venda.id,
          clienteNome: venda.cliente?.nome || 'Cliente não identificado',
          clienteEmail: venda.fk_cliente_email,
          numeroParcela: parcela.numero_parcela,
          totalParcelas: venda.parcelas.length,
          valor: parseFloat(parcela.valor_parcela),
          dataVencimento: parcela.data_vencimento,
          pago: parcela.pago
        }))
    );
    
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar contas a receber:", error);
    res.status(500).json({ 
      message: "Erro ao buscar contas a receber",
      error: error.message 
    });
  }
};

module.exports = {
  obterResumoFinanceiro,
  obterVendasDespesasPorMes,
  obterDespesasPorCategoria,
  obterProdutosMaisVendidos,
  obterAnaliseEstoque,
  obterContasAPagar,
  obterContasAReceber,
};