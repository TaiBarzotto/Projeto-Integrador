const model = require("../models");

// Função para obter todas as parcelas
const obterTodasParcelas = async () => {
  return await model.Parcela_despesa.findAll({
    include: [
      {
        model: model.Despesa,
        as: "despesa",
      },
    ],
  });
};

// Função para obter parcela por ID
const obterParcelaPorId = async (id) => {
  return await model.Parcela_despesa.findByPk(id, {
    include: [
      {
        model: model.Despesa,
        as: "despesa",
      },
    ],
  });
};

// Função para criar uma nova parcela
const criarParcela = async (parcelaData) => {
  try {
    const parcelaCriada = await model.Parcela_despesa.create(parcelaData);
    return parcelaCriada;
  } catch (error) {
    throw error;
  }
};

// Função para atualizar uma parcela
const atualizarParcela = async (id, dadosAtualizados) => {
  try {
    const parcela = await model.Parcela_despesa.findByPk(id);
    if (!parcela) return null;

    await model.Parcela_despesa.update(dadosAtualizados, { where: { id } });

    return await obterParcelaPorId(id);
  } catch (error) {
    throw error;
  }
};

// Função para deletar uma parcela
const deletarParcela = async (id) => {
  try {
    const parcela = await model.Parcela_despesa.findByPk(id);
    if (!parcela) return null;

    await model.Parcela_despesa.destroy({ where: { id } });

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
