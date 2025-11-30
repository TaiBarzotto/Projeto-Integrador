import { useState, useEffect } from 'react'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Plus, X, Trash2 } from 'lucide-react'
import { Stack } from '@mui/material'

const TAMANHOS_PADRAO = ['PP', 'P', 'M', 'G', 'GG', 'XG']
const TAMANHOS_NUMERICOS = ['34', '36', '38', '40', '42', '44', '46']

function TabPanel ({ children, value, index }) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export function ProdutoDialog ({ open, onOpenChange, produto, onSave }) {
  const [tabAtual, setTabAtual] = useState(0)
  const [formData, setFormData] = useState({
    nome: '',
    preco_venda: '',
    categorias: [],
    fornecedores: [],
    variantes: []
  })

  const [categoriasProduto, setCategoriasProduto] = useState([])
  const [fornecedoresCadastrados, setFornecedoresCadastrados] = useState([])

  // Estados para criação rápida de variantes
  const [coresDisponiveis, setCoresDisponiveis] = useState([])
  const [novaCor, setNovaCor] = useState('')
  const [tipoTamanho, setTipoTamanho] = useState('letras')

  const buscaCategoriasProdutos = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3002/produto/categorias'
      )
      setCategoriasProduto(response.data.categoria || [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      setCategoriasProduto([])
    }
  }

  const buscaFornecedores = async () => {
    try {
      const response = await axios.get('http://localhost:3002/fornecedor/todos')
      setFornecedoresCadastrados(response.data.fornecedores || [])
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
      setFornecedoresCadastrados([])
    }
  }

  useEffect(() => {
    buscaCategoriasProdutos()
    buscaFornecedores()
  }, [])

  useEffect(() => {
    if (produto) {
      setFormData({
        ...produto,
        categorias: produto.categorias?.map(c => c.id) || [],
        fornecedores: [
          ...new Set(
            produto.variantes?.flatMap(v =>
              v.fornecedores?.map(f => f.id)
            ) || []
          )
        ]
      })

      // Extrai cores únicas das variantes existentes
      const cores = [...new Set(produto.variantes?.map(v => v.cor) || [])]
      setCoresDisponiveis(cores)
    } else {
      setFormData({
        nome: '',
        preco_venda: '',
        categorias: [],
        fornecedores: [],
        variantes: []
      })
      setCoresDisponiveis([])
    }
    setTabAtual(0)
  }, [produto, open])

  const handleAddCor = () => {
    if (novaCor && !coresDisponiveis.includes(novaCor)) {
      setCoresDisponiveis([...coresDisponiveis, novaCor])
      setNovaCor('')
    }
  }

  const handleRemoveCor = cor => {
    setCoresDisponiveis(coresDisponiveis.filter(c => c !== cor))
    // Remove variantes com essa cor
    setFormData({
      ...formData,
      variantes: formData.variantes.filter(v => v.cor !== cor)
    })
  }

  const handleGerarVariacoes = () => {
    const tamanhos =
      tipoTamanho === 'letras' ? TAMANHOS_PADRAO : TAMANHOS_NUMERICOS

    if (coresDisponiveis.length === 0) {
      alert('Adicione pelo menos uma cor antes de gerar variações')
      return
    }

    const novasVariantes = []

    coresDisponiveis.forEach(cor => {
      tamanhos.forEach(tamanho => {
        // Verifica se já existe essa combinação
        const existente = formData.variantes.find(
          v => v.cor === cor && v.tamanho === tamanho
        )

        if (!existente) {
          novasVariantes.push({
            codigo_de_barras: '',
            tamanho,
            cor,
            quantidade_estoque: 0,
            limite_minimo: 0,
            ativo: true,
            custo: '',
            data_cadastro: new Date().toISOString().split('T')[0],
            fornecedores: []
          })
        }
      })
    })

    setFormData({
      ...formData,
      variantes: [...formData.variantes, ...novasVariantes]
    })
  }

  const handleAddVarianteManual = () => {
    setFormData({
      ...formData,
      variantes: [
        ...formData.variantes,
        {
          codigo_de_barras: '',
          tamanho: '',
          cor: '',
          quantidade_estoque: 0,
          limite_minimo: 0,
          ativo: true,
          custo: '',
          data_cadastro: new Date().toISOString().split('T')[0],
          fornecedores: []
        }
      ]
    })
  }

  const handleRemoveVariante = index => {
    const novasVariantes = formData.variantes.filter((_, i) => i !== index)
    setFormData({ ...formData, variantes: novasVariantes })
  }

  const handleUpdateVariante = (index, field, value) => {
    const novasVariantes = [...formData.variantes]
    novasVariantes[index] = {
      ...novasVariantes[index],
      [field]: value
    }
    setFormData({ ...formData, variantes: novasVariantes })
  }

  const handleSubmit = () => {
    if (!formData.nome || !formData.categorias.length) {
      alert('Preencha o nome do produto e selecione pelo menos uma categoria')
      return
    }

    if (formData.variantes.length === 0) {
      alert('Adicione pelo menos uma variante do produto')
      return
    }
    const fornecedoresSelecionados = formData.fornecedores.map(id =>
      fornecedoresCadastrados.find(f => f.id === id)
    )

    const produtoParaSalvar = {
      id: produto?.id,
      nome: formData.nome,
      preco_venda: formData.preco_venda,
      categorias: formData.categorias,
      variantes: formData.variantes.map(v => ({
        ...v,
        fornecedores: fornecedoresSelecionados,
        quantidade_estoque: parseInt(v.quantidade_estoque) || 0,
        limite_minimo: parseInt(v.limite_minimo) || 0
      }))
    }

    onSave(produtoParaSalvar)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>{produto ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabAtual}
            onChange={(e, newValue) => setTabAtual(newValue)}
          >
            <Tab label='Dados Básicos' />
            <Tab label='Gerador de Variantes' />
            <Tab label='Variantes e Estoque' />
          </Tabs>
        </Box>

        {/* Tab 0: Dados Básicos */}
        <TabPanel value={tabAtual} index={0}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              required
              label='Nome do Produto'
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
              placeholder='Ex: Camiseta Básica'
            />

            <FormControl fullWidth required>
              <InputLabel>Categorias</InputLabel>
              <Select
                multiple
                value={formData.categorias}
                label='Categorias'
                onChange={e =>
                  setFormData({ ...formData, categorias: e.target.value })
                }
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(id => {
                      const cat = categoriasProduto.find(c => c.id === id)
                      return (
                        <Chip key={id} label={cat?.nome || id} size='small' />
                      )
                    })}
                  </Box>
                )}
              >
                {categoriasProduto.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Fornecedores</InputLabel>
              <Select
                multiple
                value={formData.fornecedores}
                label='Fornecedores'
                onChange={e =>
                  setFormData({ ...formData, fornecedores: e.target.value })
                }
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(id => {
                      const f = fornecedoresCadastrados.find(x => x.id === id)
                      return (
                        <Chip
                          key={id}
                          label={
                            f
                              ? `${f.nome_da_marca} - ${f.nome_pessoa}`
                              : `ID ${id}`
                          }
                        />
                      )
                    })}
                  </Box>
                )}
              >
                {fornecedoresCadastrados.map(forn => (
                  <MenuItem key={forn.id} value={forn.id}>
                    {forn.nome_da_marca} - {forn.nome_pessoa}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label='Preço de Venda'
              type='number'
              inputProps={{ step: '0.01', min: 0 }}
              value={formData.preco_venda}
              onChange={e =>
                setFormData({ ...formData, preco_venda: e.target.value })
              }
              placeholder='0.00'
              helperText='Preço sugerido de venda (pode ser diferente por variante)'
            />
          </Stack>
        </TabPanel>

        {/* Tab 1: Gerador de Variantes */}
        <TabPanel value={tabAtual} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant='body2' color='text.secondary'>
              Use esta ferramenta para gerar rapidamente múltiplas variantes
              combinando cores e tamanhos
            </Typography>

            {/* Adicionar Cor */}
            <Box>
              <Typography variant='subtitle2' gutterBottom>
                Adicionar Cores
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  value={novaCor}
                  onChange={e => setNovaCor(e.target.value)}
                  placeholder='Ex: Azul, Preto, Vermelho...'
                  onKeyPress={e => e.key === 'Enter' && handleAddCor()}
                />
                <IconButton color='primary' onClick={handleAddCor}>
                  <Plus />
                </IconButton>
              </Box>
            </Box>

            {/* Cores Disponíveis */}
            <Box>
              <Typography variant='subtitle2' gutterBottom>
                Cores Disponíveis
              </Typography>
              {coresDisponiveis.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {coresDisponiveis.map(cor => (
                    <Chip
                      key={cor}
                      label={cor}
                      onDelete={() => handleRemoveCor(cor)}
                      deleteIcon={<X size={16} />}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Nenhuma cor adicionada
                </Typography>
              )}
            </Box>

            {/* Tipo de Tamanho */}
            <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant='subtitle2' gutterBottom>
                Tipo de Tamanho
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={tipoTamanho === 'letras' ? 'contained' : 'outlined'}
                  onClick={() => setTipoTamanho('letras')}
                >
                  Letras (PP, P, M, G...)
                </Button>
                <Button
                  variant={tipoTamanho === 'numeros' ? 'contained' : 'outlined'}
                  onClick={() => setTipoTamanho('numeros')}
                >
                  Números (34, 36, 38...)
                </Button>
              </Box>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 1, display: 'block' }}
              >
                Tamanhos:{' '}
                {tipoTamanho === 'letras'
                  ? TAMANHOS_PADRAO.join(', ')
                  : TAMANHOS_NUMERICOS.join(', ')}
              </Typography>
            </Box>

            {/* Gerar Variações */}
            <Box>
              <Button
                fullWidth
                variant='contained'
                onClick={handleGerarVariacoes}
                disabled={coresDisponiveis.length === 0}
              >
                Gerar Variações (Cores × Tamanhos)
              </Button>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 1, display: 'block' }}
              >
                Isso criará {coresDisponiveis.length} cores ×{' '}
                {tipoTamanho === 'letras'
                  ? TAMANHOS_PADRAO.length
                  : TAMANHOS_NUMERICOS.length}{' '}
                tamanhos ={' '}
                {coresDisponiveis.length *
                  (tipoTamanho === 'letras'
                    ? TAMANHOS_PADRAO.length
                    : TAMANHOS_NUMERICOS.length)}{' '}
                variantes
              </Typography>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 2: Variantes e Estoque */}
        <TabPanel value={tabAtual} index={2}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              {formData.variantes.length} variante(s) cadastrada(s)
            </Typography>
            <Button
              variant='outlined'
              startIcon={<Plus size={16} />}
              onClick={handleAddVarianteManual}
              size='small'
            >
              Adicionar Variante Manual
            </Button>
          </Box>

          {formData.variantes.length > 0 ? (
            <TableContainer component={Paper} variant='outlined'>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Cor</TableCell>
                    <TableCell>Tamanho</TableCell>
                    <TableCell>Código de Barras</TableCell>
                    <TableCell>Custo</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Limite Mín.</TableCell>
                    <TableCell align='center'>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.variantes.map((variante, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          size='small'
                          value={variante.cor || ''}
                          onChange={e =>
                            handleUpdateVariante(index, 'cor', e.target.value)
                          }
                          placeholder='Cor'
                          sx={{ minWidth: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size='small'
                          value={variante.tamanho || ''}
                          onChange={e =>
                            handleUpdateVariante(
                              index,
                              'tamanho',
                              e.target.value
                            )
                          }
                          placeholder='Tamanho'
                          sx={{ minWidth: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size='small'
                          value={variante.codigo_de_barras || ''}
                          onChange={e =>
                            handleUpdateVariante(
                              index,
                              'codigo_de_barras',
                              e.target.value
                            )
                          }
                          placeholder='Código'
                          sx={{ minWidth: 130 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size='small'
                          type='number'
                          inputProps={{ step: '0.01', min: 0 }}
                          value={variante.custo || ''}
                          onChange={e =>
                            handleUpdateVariante(index, 'custo', e.target.value)
                          }
                          placeholder='0.00'
                          sx={{ width: 90 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size='small'
                          type='number'
                          inputProps={{ min: 0 }}
                          value={variante.quantidade_estoque}
                          onChange={e =>
                            handleUpdateVariante(
                              index,
                              'quantidade_estoque',
                              parseInt(e.target.value) || 0
                            )
                          }
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size='small'
                          type='number'
                          inputProps={{ min: 0 }}
                          value={variante.limite_minimo}
                          onChange={e =>
                            handleUpdateVariante(
                              index,
                              'limite_minimo',
                              parseInt(e.target.value) || 0
                            )
                          }
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => handleRemoveVariante(index)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color='text.secondary'>
                Nenhuma variante cadastrada ainda.
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                Use o "Gerador de Variantes" ou adicione manualmente.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant='contained'>
          Salvar Produto
        </Button>
      </DialogActions>
    </Dialog>
  )
}
