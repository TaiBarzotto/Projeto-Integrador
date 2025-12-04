const parcelaVendaRepository = require("../repositories/parcela-venda-repository");

// Função para retornar todas as parcelas
const retornaTodasParcelas = async (req, res) => {
  try {
    const parcelas = await parcelaVendaRepository.obterTodasParcelas();
    res.status(200).json({ parcelas });
  } catch (error) {
    console.error("Erro ao buscar parcelas:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma nova parcela
const criaParcela = async (req, res) => {
  const { numero_parcela, valor_parcela, data_vencimento, pago, data_pagamento, fk_vendas_id } = req.body;

  try {
    if (!numero_parcela || !valor_parcela || !data_vencimento || !fk_vendas_id) {
      return res.status(400).json({
        message: "Número da parcela, valor, data de vencimento e ID da venda são obrigatórios."
      });
    }

    const novaParcela = await parcelaVendaRepository.criarParcela({
      numero_parcela,
      valor_parcela,
      data_vencimento,
      pago,
      data_pagamento,
      fk_vendas_id
    });

    res.status(201).json(novaParcela);
  } catch (error) {
    console.error("Erro ao criar parcela:", error);
    res.status(500).json({
      message: "Erro ao criar parcela",
      error: error.message
    });
  }
};

// Função para atualizar uma parcela
const atualizaParcela = async (req, res) => {
  const { numero_parcela, valor_parcela, data_vencimento, pago, data_pagamento } = req.body;
  const id = parseInt(req.params.id);

  try {
    const parcelaAtualizada = await parcelaVendaRepository.atualizarParcela({
      id,
      numero_parcela,
      valor_parcela,
      data_vencimento,
      pago,
      data_pagamento
    });

    if (parcelaAtualizada) {
      res.status(200).json(parcelaAtualizada);
    } else {
      res.status(404).json({ message: "Parcela não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao atualizar parcela:", error);
    res.status(500).json({
      message: "Erro ao atualizar parcela",
      error: error.message
    });
  }
};

// Função para deletar uma parcela
const deletaParcela = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parcelaRemovida = await parcelaVendaRepository.deletarParcela({ id });

    if (parcelaRemovida) {
      res.status(200).json({
        message: "Parcela removida com sucesso.",
        parcela: parcelaRemovida
      });
    } else {
      res.status(404).json({ message: "Parcela não encontrada." });
    }
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message: "Parcela não pode ser deletada pois está vinculada a uma venda."
      });
    }
    console.error("Erro ao deletar parcela:", error);
    res.status(500).json({ message: "Erro ao deletar parcela." });
  }
};

// Função para buscar parcela por ID
const retornaParcelaPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parcela = await parcelaVendaRepository.obterParcelaPorId({ id });

    if (parcela) {
      res.status(200).json(parcela);
    } else {
      res.status(404).json({ message: "Parcela não encontrada." });
    }
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
  retornaParcelaPorId
};
