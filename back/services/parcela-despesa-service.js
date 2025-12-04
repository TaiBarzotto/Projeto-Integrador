const parcelaRepository = require("../repositories/parcela-despesa-repository");

// Retornar todas as parcelas
const retornaTodasParcelas = async (req, res) => {
  try {
    const parcelas = await parcelaRepository.obterTodasParcelas();
    res.status(200).json({ parcelas });
  } catch (error) {
    console.error("Erro ao buscar parcelas:", error);
    res.sendStatus(500);
  }
};

// Criar nova parcela
const criaParcela = async (req, res) => {
  try {
    const { numero_parcela, valor_parcela, data_vencimento, pago, data_pagamento, fk_despesa_id } = req.body;

    if (!numero_parcela || !valor_parcela || !data_vencimento || !fk_despesa_id) {
      return res.status(400).json({ message: "Campos obrigatórios faltando." });
    }

    const novaParcela = await parcelaRepository.criarParcela({
      numero_parcela,
      valor_parcela,
      data_vencimento,
      pago: pago || false,
      data_pagamento: data_pagamento || null,
      fk_despesa_id,
    });

    res.status(201).json(novaParcela);
  } catch (error) {
    console.error("Erro ao criar parcela:", error);
    res.status(500).json({ message: "Erro ao criar parcela." });
  }
};

// Atualizar parcela
const atualizaParcela = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const parcelaAtualizada = await parcelaRepository.atualizarParcela(id, dados);

    if (!parcelaAtualizada) {
      return res.status(404).json({ message: "Parcela não encontrada." });
    }

    res.status(200).json(parcelaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar parcela:", error);
    res.sendStatus(500);
  }
};

// Deletar parcela
const deletaParcela = async (req, res) => {
  try {
    const { id } = req.params;

    const parcelaRemovida = await parcelaRepository.deletarParcela(id);

    if (!parcelaRemovida) {
      return res.status(404).json({ message: "Parcela não encontrada." });
    }

    res.status(200).json({
      message: "Parcela removida com sucesso.",
      parcela: parcelaRemovida,
    });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message: "Parcela não pode ser deletada pois está atrelada a outra entidade.",
      });
    }

    console.error("Erro ao deletar parcela:", error);
    res.status(500).json({ message: "Erro ao deletar parcela." });
  }
};

// Retornar parcela por ID
const retornaParcelaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const parcela = await parcelaRepository.obterParcelaPorId(id);

    if (!parcela) {
      return res.status(404).json({ message: "Parcela não encontrada." });
    }

    res.status(200).json(parcela);
  } catch (error) {
    console.error("Erro ao buscar parcela:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodasParcelas,
  criaParcela,
  atualizaParcela,
  deletaParcela,
  retornaParcelaPorId,
};
