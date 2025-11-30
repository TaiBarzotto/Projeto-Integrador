const express = require("express");
const cors = require("cors");
const fornecedorRouter = require("./controllers/fornecedor-controller");
const clienteRouter = require("./controllers/cliente-controller");
const produtoRouter = require("./controllers/produto-controller");
const usuarioRouter = require("./controllers/usuario-controller");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

app.use("/fornecedor", fornecedorRouter);
app.use("/cliente", clienteRouter);
app.use("/usuario", usuarioRouter);
app.use("/produto", produtoRouter);
