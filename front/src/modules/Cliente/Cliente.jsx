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
  DialogActions
} from '@mui/material'
import { Plus, Search, Edit, Trash2, Users, Mail, Phone } from 'lucide-react'
import { ClienteDialog } from './ClienteDialog'
import { formatDate } from '../../lib/utils'
import { jwtDecode } from 'jwt-decode'

export default function ClientesPage () {
  const [clientes, setClientes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [erro, setErro] = useState('')
  const [orderBy, setOrderBy] = useState('')
  const [order, setOrder] = useState('asc')
  const [clienteEditando, setClienteEditando] = useState({})
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const isAdmin = currentUser.administrador
  const buscaClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3002/cliente/todos')
      setClientes(response.data.clientes)
      setErro('')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    buscaClientes()
  }, [])

  const clientesFiltrados = clientes.filter(
    c =>
      c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefone?.includes(searchTerm)
  )
  const cadastrarCliente = async novoCliente => {
    console.log(novoCliente)
    try {
      const response = await axios.post(
        'http://localhost:3002/cliente',
        novoCliente
      )
      buscaClientes()
      setErro('')
    } catch (error) {
      setErro(error.response.data)
    }
  }

  const deletaCliente = async email => {
    try {
      console.log(email)
      await axios.delete('http://localhost:3002/cliente/', {
        data: { email }
      })
      setErro('')
      buscaClientes()
    } catch (error) {
      setErro(error.response.data)
      console.log(error)
    }
  }

  const atualizaCliente = async cliente => {
    try {
      console.log('DEBUG AQUI')
      console.log(cliente)
      const response = await axios.put(
        'http://localhost:3002/cliente/',
        cliente
      )
      buscaClientes()
      console.log(response.data)
      setErro('')
    } catch (error) {
      setErro(error.response.data)
      console.log(error)
    }
  }

  const handleNovoCliente = () => {
    setClienteEditando(undefined)
    setDialogOpen(true)
  }

  const handleEditarCliente = cliente => {
    setClienteEditando(cliente)
    setDialogOpen(true)
  }

  const handleSalvarCliente = cliente => {
    console.log(cliente)
    console.log(clienteEditando)
    if (clienteEditando) {
      atualizaCliente(cliente)
    } else {
      cadastrarCliente(cliente)
    }
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

  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
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

  const clientesComPromocoes = clientes.filter(c => c.aceita_promocoes).length

  return (
    <Box sx={{ p: 3 }}>
      {erro && (
        <Alert variant='filled' severity='error' sx={{ mb: 3 }}>
          {erro.message}
        </Alert>
      )}
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            Clientes
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Plus size={18} />}
          onClick={handleNovoCliente}
        >
          Novo Cliente
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
                  Total de Clientes
                </Typography>
                <Typography variant='h4' fontWeight='bold'>
                  {clientes.length}
                </Typography>
              </Box>
              <Users size={24} color='#666' />
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
                  Autorizam Promoções
                </Typography>
                <Typography variant='h4' fontWeight='bold'>
                  {clientesComPromocoes}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {Math.round((clientesComPromocoes / clientes.length) * 100)}%
                  do total
                </Typography>
              </Box>
              <Mail size={24} color='#666' />
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
                  Cadastros Completos
                </Typography>
                <Typography variant='h4' fontWeight='bold'>
                  {
                    clientes.filter(
                      c =>
                        c.Endereco &&
                        c.nascimento &&
                        c.telefone &&
                        c.email &&
                        c.nome &&
                        c.genero
                    ).length
                  }
                </Typography>
              </Box>
              <Users size={24} color='#666' />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Busca */}
      <TextField
        fullWidth
        placeholder='Buscar por nome, e-mail ou telefone...'
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

      {/* Tabela de Clientes */}
      <Card
        sx={{
          backgroundColor: 'verde.clarinho'
        }}
      >
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'nome'}
                      direction={orderBy === 'nome' ? order : 'asc'}
                      onClick={() => handleRequestSort('nome')}
                    >
                      Nome
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Cidade</TableCell>
                  <TableCell>Data Nascimento</TableCell>
                  <TableCell>Promoções</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientesOrdenados.map(cliente => (
                  <TableRow key={cliente.email} hover>
                    <TableCell>
                      <Box>
                        <Typography variant='body2' fontWeight='medium'>
                          {cliente.nome} {cliente.sobrenome}
                        </Typography>
                        {cliente.sexo && (
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {cliente.sexo}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <Phone size={14} />
                          <Typography variant='body2'>
                            {cliente.telefone}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <Mail size={14} />
                          <Typography variant='caption' color='text.secondary'>
                            {cliente.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {cliente.Endereco?.cidade || '-'}
                      </Typography>
                      {cliente.bairro && (
                        <Typography variant='caption' color='text.secondary'>
                          {cliente.bairro}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {cliente.nascimento
                          ? formatDate(cliente.nascimento)
                          : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {cliente.aceita_promocoes ? (
                        <Chip label='Sim' color='success' size='small' />
                      ) : (
                        <Chip label='Não' variant='outlined' size='small' />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size='small'
                          onClick={() => handleEditarCliente(cliente)}
                        >
                          <Edit size={16} />
                        </IconButton>
                        {isAdmin && (
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => deletaCliente(cliente.email)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Cliente */}
      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={clienteEditando}
        onSave={handleSalvarCliente}
      />
    </Box>
  )
}
