const model = require("../models")

// Função para obter todos os clientes
const obterTodosClientes = async () => {
	return await model.Cliente.findAll({
		include: [
			{
				model: model.Endereco,
				as: "Endereco",
			},
		],
	})
}

// Função para obter cliente por ID
const obterClientePorEmail = async cliente => {
	return await model.Cliente.findByPk(cliente.email, {
		include: [
			{
				model: model.Endereco,
				as: "Endereco",
			},
		],
	})
}

// Função para criar um novo cliente
const criarCliente = async (clienteData, enderecoData) => {
	let endereco = null
	try {
		if (enderecoData) {
			endereco = await model.Endereco.create(enderecoData)
		}

		const clienteCriado = await model.Cliente.create({
			...clienteData,
			fk_endereco: endereco ? endereco.id : null,
		})

		return clienteCriado
	} catch (error) {
		throw error
	}
}

// Função para atualizar um cliente
const atualizarCliente = async (email, dadosAtualizados) => {
	try {
		const cliente = await model.Cliente.findByPk(email)

		if (!cliente) return null

		// Se vier um endereço no body, atualiza ou cria
		if (dadosAtualizados.endereco) {
			if (cliente.fk_endereco) {
				// Já tem endereço → atualizar
				await model.Endereco.update(dadosAtualizados.endereco, {
					where: { id: cliente.fk_endereco },
				})
			} else {
				// Não tem endereço → criar
				const novoEndereco = await model.Endereco.create(
					dadosAtualizados.endereco,
				)
				dadosAtualizados.fk_endereco = novoEndereco.id
			}
		}

		// Atualizar cliente
		await model.Cliente.update(dadosAtualizados, {
			where: { email },
		})

		// Retornar cliente atualizado
		return await obterClientePorEmail(email)
	} catch (error) {
		throw error
	}
}

// Função para deletar um cliente
const deletarCliente = async cliente => {
	try {
		const cliente = await model.Cliente.findByPk(email)

		if (cliente.fk_endereco) {
			const outrosClientes = await model.Cliente.count({
				where: { fk_endereco: enderecoId },
			})

			// Se nenhum outro cliente usa esse endereço, pode deletar
			if (outrosClientes === 0) {
				await model.Endereco.destroy({ where: { id: enderecoId } })
			}
		}

		if (!cliente) return null

		await model.Cliente.destroy({ where: { email } })

		return cliente
	} catch (error) {
		throw error
	}
}

module.exports = {
	obterTodosClientes,
	obterClientePorEmail,
	criarCliente,
	atualizarCliente,
	deletarCliente,
}
