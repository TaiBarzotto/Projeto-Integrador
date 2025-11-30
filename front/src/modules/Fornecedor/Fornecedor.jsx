import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Alert,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Card,
  CardContent,
  TablePagination,
  Typography,
  InputAdornment,
  TableSortLabel
} from '@mui/material'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Truck,
  FileText,
  Package,
  Tag
} from 'lucide-react'
import { FornecedorDialog } from './FornecedorDialog'

export default function FornecedoresPage () {
  const [fornecedores, setFornecedores] = useState([])
  const [erro, setErro] = useState('')
  const [fornecedorEditando, setFornecedorEditando] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState('asc')

  const buscaFornecedores = async () => {
    try {
      const response = await axios.get('http://localhost:3002/fornecedor/todos')
      console.log(response.data)
      setFornecedores(response.data.fornecedores)
    } catch (error) {
      setErro(error)
      setFornecedores([])
    }
  }
  const deletaFornecedor = async id => {
    try {
      await axios.delete(`http://localhost:3002/fornecedor/${id}`)
      buscaFornecedores()
    } catch (error) {
      console.log(error)
      setErro(error.response.data)
    }
  }

  useEffect(() => {
    buscaFornecedores()
    setErro('')
  }, [])

  const cadastrarFornecedor = async novoFornecedor => {
    try {
      const response = await axios.post(
        'http://localhost:3002/fornecedor',
        novoFornecedor
      )
      buscaFornecedores()
      setErro('')
    } catch (error) {
      setErro(error.response.data)
    }
  }

  const atualizaFornecedor = async fornecedor => {
    try {
      let id = fornecedor.id
      const response = await axios.put(
        `http://localhost:3002/fornecedor/${id}`, {
          nome_pessoa: fornecedor.nome_pessoa,
          email: fornecedor.email,
          telefone: fornecedor.telefone,
          nome_da_marca: fornecedor.nome_da_marca,
        }
      )
      buscaFornecedores()
      setErro('')
    } catch (error) {
      setErro(error.response.data)
      console.log(error)
    }
  }

  const handleNovoFornecedor = () => {
    setFornecedorEditando(null)
    setDialogOpen(true)
  }

  const handleEditarFornecedor = fornecedor => {
    setFornecedorEditando(fornecedor)
    setDialogOpen(true)
  }

  const handleSalvarFornecedor = fornecedor => {
    if (fornecedor.id) {
      atualizaFornecedor(fornecedor)
    } else {
      cadastrarFornecedor(fornecedor)
    }
  }

  const handleRequestSort = (property) => {
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

  const fornecedoresFiltrados = fornecedores.filter(
    f =>
      (f.nome_pessoa?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (f.nome_da_marca?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const fornecedoresOrdenados = [...fornecedoresFiltrados].sort((a, b) => {
    if (!orderBy) return 0
    
    const aValue = (a[orderBy] || '').toLowerCase()
    const bValue = (b[orderBy] || '').toLowerCase()
    
    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {erro && (
        <Alert variant='filled' severity='error' sx={{ mb: 3 }}>
          {erro.message}
        </Alert>
      )}

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
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
            Fornecedores
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}
        >
          <Button
            fullWidth={true}
            variant='contained'
            startIcon={<Plus size={18} />}
            onClick={() => handleNovoFornecedor()}
          >
            Novo Fornecedor
          </Button>
        </Box>
      </Box>

      {/* Busca */}
      <TextField
        fullWidth
        placeholder='Buscar por representante ou marca...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiInputBase-root': {
            height: { xs: 45, md: 50 }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search size={20} />
            </InputAdornment>
          )
        }}
      />

      {/* Tabela de Fornecedores */}
      <Card
        sx={{
          backgroundColor: 'verde.clarinho'
        }}
      >
        <CardContent>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'nome_pessoa'}
                      direction={orderBy === 'nome_pessoa' ? order : 'asc'}
                      onClick={() => handleRequestSort('nome_pessoa')}
                    >
                      Representante
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'nome_da_marca'}
                      direction={orderBy === 'nome_da_marca' ? order : 'asc'}
                      onClick={() => handleRequestSort('nome_da_marca')}
                    >
                      Marca
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? fornecedoresOrdenados.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : fornecedoresOrdenados
                ).map(fornecedor => (
                  <TableRow key={fornecedor.id} hover>
                    <TableCell>
                      <Typography variant='body2'>
                        {fornecedor.nome_pessoa || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2'>
                          {fornecedor.telefone}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {fornecedor.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {fornecedor.nome_da_marca ? (
                        <Chip
                          label={fornecedor.nome_da_marca}
                          size='small'
                          variant='outlined'
                        />
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <IconButton
                          size='small'
                          onClick={() => {
                            handleEditarFornecedor(fornecedor)
                          }}
                        >
                          <Edit size={16} />
                        </IconButton>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => {
                            deletaFornecedor(fornecedor.id)
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component='div'
            count={fornecedoresOrdenados.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            labelRowsPerPage='Itens por página:'
            rowsPerPageOptions={[15, 30, 60, { value: -1, label: 'Todos' }]}
          />
        </CardContent>
      </Card>

      {/* Dialog de Fornecedor */}
      <FornecedorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fornecedor={fornecedorEditando}
        onSave={handleSalvarFornecedor}
      />
    </Box>
  )
}