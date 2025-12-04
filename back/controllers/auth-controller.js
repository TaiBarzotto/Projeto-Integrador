const express = require("express");
const passport = require("passport");
const authService = require("../services/auth-service");

const authRouter = express.Router();

// POST /login - Autenticação de usuário
authRouter.post(
	"/login",
	passport.authenticate("local", { session: false }),
	(req, res) => {
		// req.user é definido pelo passport após autenticação bem-sucedida
		// Cria o token JWT usando o email do usuário e incluindo dados importantes
		const token = authService.gerarToken(req.user);

		res.json({ 
			message: "Login successful", 
			token: token,
			user: {
				email: req.user.email,
				nome: req.user.nome,
				administrador: req.user.administrador || false
			}
		});
	},
);

// POST /logout - Logout de usuário
authRouter.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.json({ message: "Logout successful" });
	});
});

// POST /novoUsuario - Criar novo usuário
authRouter.post("/novoUsuario", async (req, res) => {
	try {
		const novoUsuario = await authService.criarNovoUsuario({
			username: req.body.username,
			passwd: req.body.passwd,
			nome: req.body.nome,
		});
		console.log("Usuário inserido:", novoUsuario.email);
		res.status(201).json({ 
			message: "Usuário criado com sucesso",
			user: novoUsuario
		});
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		res.status(400).json({ 
			message: "Erro ao criar usuário",
			error: error.message 
		});
	}
});

// GET /verificar - Verifica se o token JWT é válido
authRouter.get(
	"/verificar",
	authService.requireJWTAuth,
	(req, res) => {
		res.json({
			message: "Token válido",
			user: {
				email: req.user.email,
				nome: req.user.nome
			}
		});
	}
);

module.exports = authRouter;