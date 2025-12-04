const model = require("../models");

// Função para obter todas as parcelas
const obterTodasParcelas = async () => {
  return await model.Parcela_venda.findAll({
    include: [
      {
        model: model.Vendas,
        as: "venda",
      },
    ],
  });
};

// Função para obter parcela por ID
const obterParcelaPorId = async (parcela) => {
  return await model.Parcela_venda.findByPk(parcela.id, {
    include: [
      {
        model: model.Vendas,
        as: "venda",
      },
    ],
  });
};

// Função para criar uma nova parcela
const criarParcela = async (dadosParcela) => {
  const transaction = await model.sequelize.transaction();
  try {
    const novaParcela = await model.Parcela_venda.create(
      {
        numero_parcela: dadosParcela.numero_parcela,
        valor_parcela: dadosParcela.valor_parcela,
        data_vencimento: dadosParcela.data_vencimento,
        pago: dadosParcela.pago || false,
        data_pagamento: dadosParcela.data_pagamento || null,
        fk_vendas_id: dadosParcela.fk_vendas_id,
      },
      { transaction }
    );

    await transaction.commit();
    return await obterParcelaPorId({ id: novaParcela.id });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Função para atualizar uma parcela
const atualizarParcela = async (dadosParcela) => {
  const transaction = await model.sequelize.transaction();
  try {
    const parcela = await model.Parcela_venda.findByPk(dadosParcela.id);

    if (!parcela) {
      await transaction.rollback();
      return null;
    }

    await parcela.update(
      {
        numero_parcela: dadosParcela.numero_parcela,
        valor_parcela: dadosParcela.valor_parcela,
        data_vencimento: dadosParcela.data_vencimento,
        pago: dadosParcela.pago,
        data_pagamento: dadosParcela.data_pagamento,
      },
      { transaction }
    );

    await transaction.commit();
    return await obterParcelaPorId({ id: dadosParcela.id });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Função para deletar uma parcela
const deletarParcela = async (parcela) => {
  try {
    await model.Parcela_venda.destroy({ where: { id: parcela.id } });
    return parcela;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  obterTodasParcelas,
  obterParcelaPorId,
  criarParcela,
  atualizarParcela,
  deletarParcela,
};
