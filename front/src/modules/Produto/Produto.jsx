import { useState, useEffect } from 'react'
import axios from "axios"
import Stack from '@mui/material/Stack';


export default function Produto() {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState("");
  const [novoProdutoEmail, setNovoProdutoEmail] = useState("");
  const [idProduto, setIdProduto] = useState("");

  const buscaProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:3002/produto/todos");
      console.log(response.data);
      setProdutos(response.data.produtos);
    }
    catch (error) {
      console.log(error);
      setProdutos([]);
    }
  }

  useEffect(
    () => {
      buscaProdutos();
    },
    []);

  const cadastrarProduto = async () => {
    try{
      const response = await axios.post("http://localhost:3002/produto", {
        nome: novoProduto,
        email: novoProdutoEmail
      });
      buscaProdutos();
      console.log(response.data)
    } catch(error){
      console.log(error);
    }
  };

  const deletaProduto = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/produto/${id}`)
      buscaProdutos();
    } catch (error) {
      console.log(error);
    }
  };

  const atualizaProduto = async () => {
    try{
      let id = idProduto;
      const response = await axios.put(`http://localhost:3002/produto/${id}`, {
        id: id,
        nome: novoProduto,
        email: novoProdutoEmail
      });
      buscaProdutos();
      console.log(response.data)
    } catch(error){
      console.log(error);
    }
  };


  return (<>
    {produtos.length > 0 && <ul>
      {produtos.map((produto) => {
        return <li key={produto.id}>{produto.id} - {produto.nome}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => setIdProduto(produto.id)}
          >
            Editar
          </button>

          <button
            style={{ marginLeft: 10 }}
            className="btnExcluir"
onClick={() => { deletaProduto(produto.id); }}
          >
            Excluir
          </button>
        </li>;
      })}
    </ul>}
    <h3>{idProduto ? "Atualizar produto" : "Cadastrar novo produto"}</h3>

    <Stack spacing={1}>
      <Stack spacing={1} direction="row">
        <label>Nome do Produto: </label>
        <input type="text" value={novoProduto} onChange={(event) => setNovoProduto(event.target.value)} />
      </Stack>
      <Stack spacing={1} direction="row">
        <label>Email do Produto: </label>
        <input type="text" value={novoProdutoEmail} onChange={(event) => setNovoProdutoEmail(event.target.value)} />
      </Stack>
      <Stack spacing={1} direction="row">
        <button onClick={cadastrarProduto} disabled={idProduto !== ""}>
          Cadastrar
        </button>

        <button onClick={atualizaProduto} disabled={idProduto === ""}>
          Atualizar
        </button>
      </Stack>
    </Stack>
  </>)

}
