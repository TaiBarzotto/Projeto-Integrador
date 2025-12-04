import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  ShoppingCart,
  CheckCircle,
  Search
} from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import axios from 'axios'

// MATERIAL UI
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { TextField, InputAdornment } from '@mui/material'

// Declara um const global para facilitar as requisições
const API_BASE_URL = 'http://localhost:3002'

export default function Financeiro () {
  const theme = useTheme()
  const colors = theme.palette.cores_chart.palette
  const [contasPagarOpen, setContasPagarOpen] = useState(false)
  const [contasReceberOpen, setContasReceberOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // Estados para dados do backend
  const [resumo, setResumo] = useState(null)
  const [vendasDespesasMes, setVendasDespesasMes] = useState([])
  const [despesasPorCategoria, setDespesasPorCategoria] = useState([])
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([])
  const [analiseEstoque, setAnaliseEstoque] = useState(null)
  const [contasPagar, setContasPagar] = useState([])
  const [contasReceber, setContasReceber] = useState([])

  // Estados de loading e erro
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar todos os dados do dashboard
  const carregarDados = async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        resResumo,
        resVendasDespesas,
        resDespesasCategoria,
        resProdutos,
        resEstoque
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/financeiro/resumo`),
        axios.get(`${API_BASE_URL}/financeiro/vendas-despesas-mes`),
        axios.get(`${API_BASE_URL}/financeiro/despesas-categoria`),
        axios.get(`${API_BASE_URL}/financeiro/produtos-mais-vendidos?limite=5`),
        axios.get(`${API_BASE_URL}/financeiro/analise-estoque`)
      ])
      console.log(resResumo)
      setResumo(resResumo.data)
      setVendasDespesasMes(resVendasDespesas.data)
      setDespesasPorCategoria(resDespesasCategoria.data)
      setProdutosMaisVendidos(resProdutos.data)
      setAnaliseEstoque(resEstoque.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados financeiros. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Carregar contas a pagar
   */
  const carregarContasPagar = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/financeiro/contas-pagar`
      )
      setContasPagar(response.data)
      setSearchTerm('')
      setContasPagarOpen(true)
    } catch (error) {
      console.error('Erro ao carregar contas a pagar:', error)
      setError('Erro ao carregar contas a pagar.')
    }
  }

  /**
   * Carregar contas a receber
   */
  const carregarContasReceber = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/financeiro/contas-receber`
      )
      setContasReceber(response.data)
      setSearchTerm('')
      setContasReceberOpen(true)
    } catch (error) {
      console.error('Erro ao carregar contas a receber:', error)
      setError('Erro ao carregar contas a receber.')
    }
  }

  /**
   * Marcar parcela de despesa como paga
   */
  const handleMarcarDespesaPaga = async (despesaId, parcelaNumero) => {
    try {
      await axios.put(`${API_BASE_URL}/parcela-despesa/${despesaId}`, {
        numero_parcela: parcelaNumero,
        pago: true,
        data_pagamento: new Date()
      })

      // Recarregar dados
      await carregarContasPagar()
      await carregarDados()
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error)
      setError('Erro ao atualizar despesa.')
    }
  }


  //Marcar parcela de venda como recebida   
  const handleMarcarVendaRecebida = async (vendaId, parcelaNumero) => {
    try {
      await axios.put(`${API_BASE_URL}/parcela-venda/${vendaId}`, {
        numero_parcela: parcelaNumero,
        pago: true,
        data_pagamento: new Date()
      })

      // Recarregar dados
      await carregarContasReceber()
      await carregarDados()
    } catch (error) {
      console.error('Erro ao atualizar venda:', error)
      setError('Erro ao atualizar venda.')
    }
  }

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados()
  }, [])

  const contasPagarFiltrado = contasPagar.filter(
    c =>
      c.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  const contasReceberFiltrado = contasReceber.filter(
    c =>
      c.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  // Exibir loading
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      {/* Título */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant='h2' fontWeight='bold' color='#0A0A0A' gutterBottom>
          Módulo Financeiro
        </Typography>
      </Box>

      {/* Exibir erro se houver */}
      {error && (
        <Alert
          severity='error'
          sx={{ marginBottom: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Cards de Ações */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 4, width: '100%' }}>
        {/* Ver Vendas */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              backgroundColor: '#E2E5DE',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': { boxShadow: 6 }
            }}
            onClick={() => navigate('/emDev')}
          >
            <CardHeader
              title={<Typography variant='subtitle2'>Vendas</Typography>}
              action={<ShoppingCart style={{ color: '#16a34a' }} size={20} />}
              sx={{ paddingBottom: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant='h5'
                sx={{ color: '#16a34a', fontWeight: 'bold', marginBottom: 1 }}
              >
                {formatCurrency(resumo?.totalVendas || 0)}
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                sx={{ marginBottom: 1 }}
              >
                {resumo?.quantidadeVendas || 0} vendas registradas
              </Typography>
              <Button
                variant='text'
                size='small'
                sx={{ padding: 0, textTransform: 'none', minWidth: 'auto' }}
              >
                Ver todas as vendas →
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Ver Despesas */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              backgroundColor: '#E2E5DE',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': { boxShadow: 6 }
            }}
            onClick={() => navigate('/emDev')}
          >
            <CardHeader
              title={<Typography variant='subtitle2'>Despesas</Typography>}
              action={<Receipt style={{ color: '#dc2626' }} size={20} />}
              sx={{ paddingBottom: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant='h5'
                sx={{ color: '#dc2626', fontWeight: 'bold', marginBottom: 1 }}
              >
                {formatCurrency(resumo?.totalDespesas || 0)}
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                sx={{ marginBottom: 1 }}
              >
                {resumo?.quantidadeDespesas || 0} despesas registradas
              </Typography>
              <Button
                variant='text'
                size='small'
                sx={{ padding: 0, textTransform: 'none', minWidth: 'auto' }}
              >
                Ver todas as despesas →
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Contas a Pagar */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              backgroundColor: '#E2E5DE',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': { boxShadow: 6 }
            }}
            onClick={carregarContasPagar}
          >
            <CardHeader
              title={
                <Typography variant='subtitle2'>Contas a Pagar</Typography>
              }
              action={<TrendingDown style={{ color: '#ea580c' }} size={20} />}
              sx={{ paddingBottom: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant='h5'
                sx={{ color: '#ea580c', fontWeight: 'bold', marginBottom: 1 }}
              >
                {formatCurrency(resumo?.totalAPagar || 0)}
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                sx={{ marginBottom: 1 }}
              >
                Despesas pendentes
              </Typography>
              <Button
                variant='text'
                size='small'
                sx={{ padding: 0, textTransform: 'none', minWidth: 'auto' }}
              >
                Ver contas a pagar →
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Contas a Receber */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              backgroundColor: '#E2E5DE',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': { boxShadow: 6 }
            }}
            onClick={carregarContasReceber}
          >
            <CardHeader
              title={
                <Typography variant='subtitle2'>Contas a Receber</Typography>
              }
              action={<TrendingUp style={{ color: '#2563eb' }} size={20} />}
              sx={{ paddingBottom: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant='h5'
                sx={{ color: '#2563eb', fontWeight: 'bold', marginBottom: 1 }}
              >
                {formatCurrency(resumo?.totalAReceber || 0)}
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                sx={{ marginBottom: 1 }}
              >
                Vendas pendentes
              </Typography>
              <Button
                variant='text'
                size='small'
                sx={{ padding: 0, textTransform: 'none', minWidth: 'auto' }}
              >
                Ver contas a receber →
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Resumo Financeiro Diário */}
      <Card sx={{ backgroundColor: '#E2E5DE', marginBottom: 4 }}>
        <CardHeader
          title={<Typography variant='h6'>Resumo Financeiro Diário</Typography>}
          subheader='Visão geral do fluxo de caixa'
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Total de Receitas */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    padding: 1.5,
                    backgroundColor: '#dcfce7',
                    borderRadius: '50%'
                  }}
                >
                  <TrendingUp style={{ color: '#16a34a' }} size={20} />
                </Box>
                <Box>
                  <Typography variant='body2'>Total de Receitas</Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Vendas realizadas
                  </Typography>
                </Box>
              </Box>
              <Typography variant='h6' sx={{ color: '#16a34a' }}>
                {formatCurrency(resumo?.vendasHoje || 0)}
              </Typography>
            </Box>

            {/* Total de Despesas */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    padding: 1.5,
                    backgroundColor: '#fee2e2',
                    borderRadius: '50%'
                  }}
                >
                  <TrendingDown style={{ color: '#dc2626' }} size={20} />
                </Box>
                <Box>
                  <Typography variant='body2'>Total de Despesas</Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Gastos registrados
                  </Typography>
                </Box>
              </Box>
              <Typography variant='h6' sx={{ color: '#dc2626' }}>
                {formatCurrency(resumo?.despesasHoje || 0)}
              </Typography>
            </Box>

            {/* Saldo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: 'rgba(25, 118, 210, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    padding: 1.5,
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    borderRadius: '50%'
                  }}
                >
                  <DollarSign style={{ color: '#1976d2' }} size={20} />
                </Box>
                <Box>
                  <Typography variant='body2'>Saldo</Typography>
                  <Typography variant='caption' color='text.secondary'>
                    Receitas - Despesas
                  </Typography>
                </Box>
              </Box>
              <Typography variant='h5'>
                {formatCurrency(resumo?.saldoHoje || 0)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog: Contas a Pagar */}
      <Dialog
        open={contasPagarOpen}
        onClose={() => setContasPagarOpen(false)}
        fullWidth
        maxWidth='xl'
      >
        <DialogTitle>Contas a Pagar</DialogTitle>
        <TextField
                fullWidth
                placeholder='Buscar por descrição ou categoria...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search size={20} />
                    </InputAdornment>
                  )
                }}
              />
        <DialogContent>
          {contasPagarFiltrado.length === 0 ? (
            <Typography
              align='center'
              color='text.secondary'
              sx={{ padding: 4 }}
            >
              Nenhuma conta a pagar no momento
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Parcela</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasPagarFiltrado.map((conta, index) => (
                  <TableRow
                    key={`${conta.despesaId}-${conta.numeroParcela}-${index}`}
                  >
                    <TableCell>{conta.descricao}</TableCell>
                    <TableCell>{conta.categoria}</TableCell>
                    <TableCell>
                      {conta.numeroParcela}/{conta.totalParcelas}
                    </TableCell>
                    <TableCell>{formatDate(conta.dataVencimento)}</TableCell>
                    <TableCell sx={{ color: '#dc2626' }}>
                      {formatCurrency(conta.valor)}
                    </TableCell>
                    <TableCell>
                      <Chip label='Pendente' color='error' size='small' />
                    </TableCell>
                    <TableCell>
                      <Tooltip title='Marcar como Pago'>
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() =>
                            handleMarcarDespesaPaga(
                              conta.despesaId,
                              conta.numeroParcela
                            )
                          }
                        >
                          <CheckCircle size={16} />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Contas a Receber */}
      <Dialog
        open={contasReceberOpen}
        onClose={() => setContasReceberOpen(false)}
        fullWidth
        maxWidth='xl'
      >
        <DialogTitle>Contas a Receber</DialogTitle>
        <TextField
                fullWidth
                placeholder='Buscar por nome do cliente'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search size={20} />
                    </InputAdornment>
                  )
                }}
              />
        <DialogContent>
          {contasReceberFiltrado.length === 0 ? (
            <Typography
              align='center'
              color='text.secondary'
              sx={{ padding: 4 }}
            >
              Nenhuma conta a receber no momento
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Parcela</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasReceberFiltrado.map((conta, index) => (
                  <TableRow
                    key={`${conta.vendaId}-${conta.numeroParcela}-${index}`}
                  >
                    <TableCell>{conta.clienteNome}</TableCell>
                    <TableCell>
                      {conta.numeroParcela}/{conta.totalParcelas}
                    </TableCell>
                    <TableCell>{formatDate(conta.dataVencimento)}</TableCell>
                    <TableCell sx={{ color: '#16a34a' }}>
                      {formatCurrency(conta.valor)}
                    </TableCell>
                    <TableCell>
                      <Chip label='Pendente' color='error' size='small' />
                    </TableCell>
                    <TableCell>
                      <Tooltip title='Marcar como Recebido'>
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() =>
                            handleMarcarVendaRecebida(
                              conta.vendaId,
                              conta.numeroParcela
                            )
                          }
                        >
                          <CheckCircle size={16} />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* Gráficos */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 4 }}>
        {/* Vendas vs Despesas */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ backgroundColor: '#E2E5DE' }}>
            <CardHeader
              title={<Typography variant='h6'>Vendas vs Despesas</Typography>}
              subheader='Últimos 6 meses'
            />
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={vendasDespesasMes}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='mes_ano' />
                  <YAxis />
                  <RechartsTooltip formatter={value => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey='vendas' fill='#10b981' name='Vendas' />
                  <Bar dataKey='despesas' fill='#ef4444' name='Despesas' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Despesas por Categoria */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ backgroundColor: '#E2E5DE' }}>
            <CardHeader
              title={
                <Typography variant='h6'>Despesas por Categoria</Typography>
              }
              subheader='Distribuição total'
            />
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={despesasPorCategoria}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ nome, valor }) =>
                      `${nome}: ${formatCurrency(valor)}`
                    }
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='valor'
                  >
                    {despesasPorCategoria.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={value => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Produtos Mais Vendidos */}
      <Card sx={{ backgroundColor: '#E2E5DE', marginBottom: 4 }}>
        <CardHeader
          title={<Typography variant='h6'>Produtos Mais Vendidos</Typography>}
          subheader='Top 5 produtos'
        />
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={produtosMaisVendidos} layout='vertical'>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis type='number' />
              <YAxis dataKey='nome' type='category' width={150} />
              <RechartsTooltip />
              <Bar dataKey='vendas' fill='#3b82f6' name='Unidades Vendidas' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise de Estoque */}
      <Card sx={{ backgroundColor: '#E2E5DE', marginBottom: 4 }}>
        <CardHeader
          title={<Typography variant='h6'>Análise de Estoque</Typography>}
          subheader='Produtos que necessitam atenção'
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Estoque baixo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1
              }}
            >
              <Box>
                <Typography variant='body2'>
                  Produtos com Estoque Baixo
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Abaixo do limite mínimo
                </Typography>
              </Box>
              <Typography variant='h5' sx={{ color: '#dc2626' }}>
                {analiseEstoque?.produtosBaixoEstoque || 0}
              </Typography>
            </Box>

            {/* Estoque ideal */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1
              }}
            >
              <Box>
                <Typography variant='body2'>
                  Produtos em Estoque Ideal
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Dentro dos parâmetros
                </Typography>
              </Box>
              <Typography variant='h5' sx={{ color: '#16a34a' }}>
                {analiseEstoque?.produtosEstoqueIdeal || 0}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
