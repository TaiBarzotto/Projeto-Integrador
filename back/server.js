const express = require("express");
const cors = require("cors");
const fornecedorRouter = require("./controllers/fornecedor-controller");
const clienteRouter = require("./controllers/cliente-controller");
const produtoRouter = require("./controllers/produto-controller");
const usuarioRouter = require("./controllers/usuario-controller");
const parcelaVendaRouter = require("./controllers/parcela-venda-controller")
const parcelaDespesaRouter = require("./controllers/parcela-despesa-controller")
const financeiroRouter = require("./controllers/financeiro-controller");
const authRouter = require("./controllers/auth-controller");
const authService = require("./services/auth-service");

const session = require("express-session");
const passport = require("passport");

const app = express();
app.use(cors());
app.use(express.json());

// Configurar express-session ANTES do passport.session()
app.use(
    session({
        secret: "Frase_BeM_DoIdAAAAAA:)",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // false para desenvolvimento (true requer HTTPS)
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// Configurar estratégias do Passport
authService.configureLocalStrategy();
authService.configureJwtStrategy();
authService.configureSerialization();

// Usar o router de autenticação
app.use("/", authRouter);

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

app.use("/fornecedor", fornecedorRouter);
app.use("/cliente", clienteRouter);
app.use("/usuario", usuarioRouter);
app.use("/produto", produtoRouter);
app.use("/parcela-despesa", parcelaDespesaRouter);
app.use("/parcela-venda", parcelaVendaRouter)
app.use("/financeiro", financeiroRouter);
