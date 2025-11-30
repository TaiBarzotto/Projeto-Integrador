import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Typography,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
  Grid,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Alert
} from '@mui/material'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { ProdutoDialog } from './ProdutoDialog'
import { formatCurrency } from '../../lib/utils'

export default function Produto () {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const currentUser = JSON.parse(localStorage.getItem('user'))

  const [produtos, setProdutos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [erro, setErro] = useState('')
  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState('asc')
  const [produtosExpandidos, setProdutosExpandidos] = useState(new Set())

  const isAdmin = currentUser.administrador

  // Filtro melhorado que busca também nos códigos de barras das variantes
  const produtosFiltrados = produtos.filter(p => {
    const buscaLower = searchTerm.toLowerCase()
    const nomeMatch = p.nome.toLowerCase().includes(buscaLower)
    const codigoMatch = p.variantes?.some(v =>
      v.codigo_de_barras?.includes(searchTerm)
    )
    return nomeMatch || codigoMatch
  })

  const buscaProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/produto/info')
      console.log('Produtos:', response.data)
      setProdutos(response.data.produtos)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setProdutos([])
    }
  }

  useEffect(() => {
    buscaProdutos()
  }, [])

  const deletaProdutos = async id => {
    try {
      await axios.delete(`http://localhost:3002/produto/${id}`)
      buscaProdutos()
    } catch (error) {
      console.log(error)
      setErro(error.response.data)
    }
  }
  const cadastrarProduto = async novoProduto => {
    try {
      const response = await axios.post(
        'http://localhost:3002/produto',
        novoProduto
      )
      buscaProdutos()
      setErro('')
    } catch (error) {
      setErro(error.response.data)
    }
  }

  const atualizaProduto = async produto => {
    try {
      let id = produto.id
      const response = await axios.put(`http://localhost:3002/produto/${id}`, {
        nome: produto.nome,
        preco_venda: produto.preco_venda,
        categorias: produto.categorias,
        variantes: produto.variantes
      })
      buscaProdutos()
      setErro('')
    } catch (error) {
      setErro(error.response.data)
      console.log(error)
    }
  }

  const handleNovoProduto = () => {
    setProdutoEditando(null)
    setDialogOpen(true)
  }

  const handleEditarProduto = produto => {
    setProdutoEditando(produto)
    setDialogOpen(true)
  }

  // Retorna array de cores únicas
  const getCores = produto => {
    if (!produto.variantes || produto.variantes.length === 0) return []
    const coresUnicas = [...new Set(produto.variantes.map(v => v.cor))]
    return coresUnicas.filter(Boolean) // Remove valores null/undefined
  }

  const getCategorias = produto => {
    if (!produto.categorias || produto.categorias.length === 0) return []
    console.log(produto.categorias)
    const categorias = [...new Set(produto.categorias.map(c => c.nome))]
    return categorias.filter(Boolean) // Remove valores null/undefined
  }

  const getFornecedor = produto => {
    if (!produto.variantes || produto.variantes.length === 0) return []
    const fornecedores = produto.variantes
      .flatMap(v => v.fornecedores || [])
      .map(f => ({
        nome_pessoa: f.nome_pessoa,
        nome_marca: f.nome_da_marca
      }))

    // Remover duplicados com base em nome_pessoa + nome_marca
    const unique = [
      ...new Map(
        fornecedores.map(f => [`${f.nome_da_marca}-${f.nome_pessoa}`, f])
      ).values()
    ]

    return unique
  }

  // Retorna o estoque total somando todas as variantes
  const getEstoqueTotal = produto => {
    if (!produto.variantes || produto.variantes.length === 0) return 0
    return produto.variantes.reduce(
      (sum, v) => sum + (v.quantidade_estoque || 0),
      0
    )
  }

  // Verifica se alguma variante está com estoque baixo
  const getEstoqueBaixo = produto => {
    if (!produto.variantes || produto.variantes.length === 0) return false
    return produto.variantes.some(
      v => v.quantidade_estoque < (v.limite_minimo || 10)
    )
  }

  const handleSalvarProduto = async produto => {
    if (produto.id) {
      atualizaProduto(produto)
    } else {
      cadastrarProduto(produto)
    }
  }

  const toggleExpandir = produtoId => {
    const novosExpandidos = new Set(produtosExpandidos)
    if (novosExpandidos.has(produtoId)) {
      novosExpandidos.delete(produtoId)
    } else {
      novosExpandidos.add(produtoId)
    }
    setProdutosExpandidos(novosExpandidos)
  }

  const handleRequestSort = property => {
    if (orderBy === property) {
      // Ciclo: asc -> desc -> sem ordenação
      if (order === 'asc') {
        setOrder('desc')
      } else if (order === 'desc') {
        setOrderBy('')
        setOrder('asc')
      }
    } else {
      setOrderBy(property)
      setOrder('asc')
    }
  }

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (!orderBy) return 0

    // Tratamento especial para status (campo calculado)
    if (orderBy === 'status') {
      const aStatus = getEstoqueBaixo(a) ? 1 : 0 // Baixo = 1, Normal = 0
      const bStatus = getEstoqueBaixo(b) ? 1 : 0

      if (aStatus < bStatus) {
        return order === 'asc' ? -1 : 1
      }
      if (aStatus > bStatus) {
        return order === 'asc' ? 1 : -1
      }
      return 0
    }

    // Ordenação padrão para campos string
    const aValue = (a[orderBy] || '').toString().toLowerCase()
    const bValue = (b[orderBy] || '').toString().toLowerCase()

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })


  // Componente Card para Mobile
  const ProdutoCard = ({ produto }) => {
    const isExpanded = produtosExpandidos.has(produto.id)
    const estoqueBaixo = getEstoqueBaixo(produto)
    const cores = getCores(produto)
    const fornecedorProduto = getFornecedor(produto)
    const categoriasProduto = getCategorias(produto)

    return (
      <Card sx={{ mb: 2, backgroundColor: 'verde.clarinho' }}>
        <CardContent>
          <Stack spacing={2}>
            {/* Header do Card */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  {produto.nome}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size='small'
                  onClick={() => toggleExpandir(produto.id)}
                >
                  {isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </IconButton>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => handleEditarProduto(produto)}
                >
                  <Edit size={18} />
                </IconButton>
                {isAdmin && (
                  <IconButton
                    size='small'
                    color='error'
                    onClick={() => deletaProdutos(produto.id)}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                )}
              </Box>
            </Box>

            <Divider />

            {/* Informações Principais */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant='caption' color='text.secondary'>
                  Preço
                </Typography>
                <Typography variant='body2' fontWeight='bold' color='primary'>
                  {formatCurrency(produto.preco_venda)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='caption' color='text.secondary'>
                  Estoque
                </Typography>
                <Typography variant='body2'>
                  {getEstoqueTotal(produto)} un.
                </Typography>
              </Grid>
            </Grid>

            {/* Cores */}
            {cores.length > 0 && (
              <Box>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  display='block'
                  sx={{ mb: 0.5 }}
                >
                  Cores
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {cores.slice(0, 3).map((cor, idx) => (
                    <Chip
                      key={`${cor}-${idx}`}
                      label={cor}
                      size='small'
                      variant='outlined'
                    />
                  ))}
                  {cores.length > 3 && (
                    <Chip
                      label={`+${cores.length - 3}`}
                      size='small'
                      variant='outlined'
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Status */}
            <Box>
              {estoqueBaixo ? (
                <Chip
                  icon={<AlertTriangle size={14} />}
                  label='Estoque Baixo'
                  color='error'
                  size='small'
                />
              ) : (
                <Chip label='Normal' color='success' size='small' />
              )}
            </Box>

            {/* Detalhes Expandidos */}
            <Collapse in={isExpanded}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant='subtitle2' gutterBottom>
                Categorias do Produto
              </Typography>
              {categoriasProduto.map((nome, nomeIdx) => (
                <Chip label={nome} variant='outlined' />
              ))}
              <Typography variant='subtitle2' gutterBottom>
                Fornecedor(es) do Produto
              </Typography>
              {fornecedorProduto.map((forn, idx) => (
                <Chip
                  key={idx}
                  label={`${forn.nome_marca} - ${forn.nome_pessoa}`}
                  variant='outlined'
                />
              ))}
              <Typography variant='subtitle2' gutterBottom>
                Variações do Produto
              </Typography>
              <Stack spacing={1}>
                {cores.map((cor, corIdx) => (
                  <Paper
                    key={`${cor}-${corIdx}`}
                    variant='outlined'
                    sx={{ p: 1.5 }}
                  >
                    <Chip
                      label={cor}
                      size='small'
                      variant='outlined'
                      sx={{ mb: 1 }}
                    />
                    <Grid container spacing={1}>
                      {produto.variantes
                        .filter(variante => variante.cor === cor)
                        .map((variante, idx) => (
                          <Grid item xs={6} key={`${variante.id}-${idx}`}>
                            <Paper variant='outlined' sx={{ p: 1 }}>
                              <Stack spacing={0.5}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                  >
                                    Tamanho
                                  </Typography>
                                  <Chip label={variante.tamanho} size='small' />
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                  >
                                    Estoque
                                  </Typography>
                                  <Typography
                                    variant='caption'
                                    color={
                                      variante.quantidade_estoque <
                                      (variante.limite_minimo || 10)
                                        ? 'error'
                                        : 'text.primary'
                                    }
                                  >
                                    {variante.quantidade_estoque} un.
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          </Grid>
                        ))}
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Typography
            variant='h2'
            fontWeight='bold'
            color='#0A0A0A'
            gutterBottom
          >
            Produtos
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Gerencie o catálogo de produtos da loja
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Plus size={18} />}
          onClick={handleNovoProduto}
          fullWidth={isMobile}
        >
          Novo Produto
        </Button>
      </Box>

      {/* Estatísticas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 2,
          mb: 3
        }}
      >
        <Card
          sx={{
            backgroundColor: 'verde.clarinho'
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Total de Produtos
                </Typography>
                <Typography variant='h4' fontWeight='bold'>
                  {produtos.length}
                </Typography>
              </Box>
              <Package size={24} color='#666' />
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: 'verde.clarinho'
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Itens em Estoque
                </Typography>
                <Typography variant='h4' fontWeight='bold'>
                  {produtos.reduce((sum, p) => sum + getEstoqueTotal(p), 0)}
                </Typography>
              </Box>
              <Package size={24} color='#666' />
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: 'verde.clarinho'
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Alertas de Estoque
                </Typography>
                <Typography variant='h4' fontWeight='bold' color='error'>
                  {produtos.filter(p => getEstoqueBaixo(p)).length}
                </Typography>
              </Box>
              <AlertTriangle size={24} color={theme.palette.error.main} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Busca */}
      <TextField
        fullWidth
        placeholder='Buscar por nome ou código de barras...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        size={isMobile ? 'small' : 'medium'}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search size={20} />
            </InputAdornment>
          )
        }}
      />

      {/* Versão Mobile - Cards */}
      {isMobile ? (
        <Box>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {produtosFiltrados.length} produto(s) encontrado(s)
          </Typography>
          {produtosFiltrados.map(produto => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </Box>
      ) : (
        /* Versão Desktop/Tablet - Tabela */
        <Card
          sx={{
            backgroundColor: 'verde.clarinho'
          }}
        >
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Lista de Produtos
            </Typography>

            <TableContainer>
              <Table size={isTablet ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'nome'}
                        direction={orderBy === 'nome' ? order : 'asc'}
                        onClick={() => handleRequestSort('nome')}
                      >
                        Produto
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Cores</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'status'}
                        direction={orderBy === 'status' ? order : 'asc'}
                        onClick={() => handleRequestSort('status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align='center'>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produtosOrdenados.map(produto => {
                    const isExpanded = produtosExpandidos.has(produto.id)
                    const cores = getCores(produto)
                    const fornecedorProduto = getFornecedor(produto)
                    const categoriasProduto = getCategorias(produto)

                    return (
                      <>
                        <TableRow key={produto.id} hover>
                          <TableCell>
                            <Typography variant='body2'>
                              {produto.nome}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant='body2' fontWeight='medium'>
                              {formatCurrency(produto.preco_venda)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant='body2'>
                                {getEstoqueTotal(produto)} unidades
                              </Typography>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                {produto.variantes?.length || 0} variantes
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5
                              }}
                            >
                              {cores.slice(0, 3).map((cor, idx) => (
                                <Chip
                                  key={`${cor}-${idx}`}
                                  label={cor}
                                  size='small'
                                  variant='outlined'
                                />
                              ))}
                              {cores.length > 3 && (
                                <Chip
                                  label={`+${cores.length - 3}`}
                                  size='small'
                                  variant='outlined'
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {getEstoqueBaixo(produto) ? (
                              <Chip
                                icon={<AlertTriangle size={14} />}
                                label='Baixo'
                                color='error'
                                size='small'
                              />
                            ) : (
                              <Chip
                                label='Normal'
                                color='success'
                                size='small'
                              />
                            )}
                          </TableCell>
                          <TableCell align='center'>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 0.5,
                                justifyContent: 'center'
                              }}
                            >
                              <IconButton
                                size='small'
                                onClick={() => toggleExpandir(produto.id)}
                                title={
                                  isExpanded
                                    ? 'Ocultar detalhes'
                                    : 'Ver detalhes'
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown size={18} />
                                ) : (
                                  <ChevronRight size={18} />
                                )}
                              </IconButton>
                              <IconButton
                                size='small'
                                color='primary'
                                onClick={() => handleEditarProduto(produto)}
                              >
                                <Edit size={18} />
                              </IconButton>
                              {isAdmin && (
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() => deletaProdutos(produto.id)}
                                >
                                  <Trash2 size={18} />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>

                        {/* Linha Expandida */}
                        <TableRow>
                          <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                            <Collapse
                              in={isExpanded}
                              timeout='auto'
                              unmountOnExit
                            >
                              <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                                <Typography variant='subtitle2' gutterBottom>
                                  Categorias do Produto
                                </Typography>
                                {categoriasProduto.map((nome, nomeIdx) => (
                                  <Chip label={nome} variant='outlined' />
                                ))}
                                <Typography variant='subtitle2' gutterBottom>
                                  Fornecedor(es) do Produto
                                </Typography>
                                {fornecedorProduto.map((forn, idx) => (
                                  <Chip
                                    key={idx}
                                    label={`${forn.nome_marca} - ${forn.nome_pessoa}`}
                                    variant='outlined'
                                  />
                                ))}
                                <Typography variant='subtitle2' gutterBottom>
                                  Variações do Produto
                                </Typography>
                                <Typography
                                  variant='caption'
                                  color='text.secondary'
                                  sx={{ mb: 2, display: 'block' }}
                                >
                                  Detalhamento por cor, tamanho, preço e código
                                  de barras
                                </Typography>

                                <Stack spacing={2}>
                                  {cores.map((cor, corIdx) => (
                                    <Paper
                                      key={`${cor}-${corIdx}`}
                                      variant='outlined'
                                      sx={{ p: 2 }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                          mb: 2
                                        }}
                                      >
                                        <Stack spacing={2}>
                                          <Grid>
                                            <Typography variant='body2'>
                                              Cor:
                                            </Typography>
                                            <Chip
                                              label={cor}
                                              variant='outlined'
                                            />
                                          </Grid>
                                          <Typography variant='body2'>
                                            Variações disponíveis:
                                          </Typography>
                                        </Stack>
                                      </Box>

                                      <Grid container spacing={2}>
                                        {produto.variantes
                                          .filter(
                                            variante => variante.cor === cor
                                          )
                                          .map((variante, idx) => (
                                            <Grid
                                              item
                                              xs={12}
                                              sm={6}
                                              md={4}
                                              key={`${variante.id}-${idx}`}
                                            >
                                              <Paper
                                                variant='outlined'
                                                sx={{ p: 2 }}
                                              >
                                                <Stack spacing={1}>
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      justifyContent:
                                                        'space-between'
                                                    }}
                                                  >
                                                    <Typography
                                                      variant='caption'
                                                      color='text.secondary'
                                                    >
                                                      Tamanho:
                                                    </Typography>
                                                    <Chip
                                                      label={variante.tamanho}
                                                      size='small'
                                                    />
                                                  </Box>
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      justifyContent:
                                                        'space-between'
                                                    }}
                                                  >
                                                    <Typography
                                                      variant='caption'
                                                      color='text.secondary'
                                                    >
                                                      Preço:
                                                    </Typography>
                                                    <Typography variant='caption'>
                                                      {formatCurrency(
                                                        produto.preco_venda
                                                      )}
                                                    </Typography>
                                                  </Box>
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      justifyContent:
                                                        'space-between'
                                                    }}
                                                  >
                                                    <Typography
                                                      variant='caption'
                                                      color='text.secondary'
                                                    >
                                                      Estoque:
                                                    </Typography>
                                                    <Typography
                                                      variant='caption'
                                                      color={
                                                        variante.quantidade_estoque <
                                                        (variante.limite_minimo ||
                                                          10)
                                                          ? 'error'
                                                          : 'text.primary'
                                                      }
                                                    >
                                                      {
                                                        variante.quantidade_estoque
                                                      }{' '}
                                                      un.
                                                    </Typography>
                                                  </Box>
                                                  {variante.codigo_de_barras && (
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        justifyContent:
                                                          'space-between'
                                                      }}
                                                    >
                                                      <Typography
                                                        variant='caption'
                                                        color='text.secondary'
                                                      >
                                                        Cód. Barras:
                                                      </Typography>
                                                      <Typography
                                                        variant='caption'
                                                        sx={{
                                                          fontFamily:
                                                            'monospace'
                                                        }}
                                                      >
                                                        {
                                                          variante.codigo_de_barras
                                                        }
                                                      </Typography>
                                                    </Box>
                                                  )}
                                                  <Divider />
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      justifyContent:
                                                        'space-between'
                                                    }}
                                                  >
                                                    <Typography
                                                      variant='caption'
                                                      color='text.secondary'
                                                    >
                                                      Limite Mín:
                                                    </Typography>
                                                    <Typography variant='caption'>
                                                      {variante.limite_minimo ||
                                                        10}{' '}
                                                      un.
                                                    </Typography>
                                                  </Box>
                                                  {variante.custo && (
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        justifyContent:
                                                          'space-between'
                                                      }}
                                                    >
                                                      <Typography
                                                        variant='caption'
                                                        color='text.secondary'
                                                      >
                                                        Custo:
                                                      </Typography>
                                                      <Typography variant='caption'>
                                                        {formatCurrency(
                                                          variante.custo
                                                        )}
                                                      </Typography>
                                                    </Box>
                                                  )}
                                                </Stack>
                                              </Paper>
                                            </Grid>
                                          ))}
                                      </Grid>
                                    </Paper>
                                  ))}
                                </Stack>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Produto */}
      <ProdutoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        produto={produtoEditando}
        onSave={handleSalvarProduto}
      />
    </Box>
  )
}
