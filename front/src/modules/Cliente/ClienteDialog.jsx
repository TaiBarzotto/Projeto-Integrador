import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack
} from '@mui/material'

export function ClienteDialog ({ open, onOpenChange, cliente, onSave }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    genero: '',
    telefone: '',
    nascimento: '',
    aceita_promocoes: false,
    Endereco: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  })

  useEffect(() => {
    if (cliente) {
      setFormData(prev => ({
        ...cliente,
        Endereco: {
          ...cliente.Endereco
        }
      }))
    } else {
      setFormData({
        nome: '',
        email: '',
        genero: '',
        telefone: '',
        nascimento: '',
        aceita_promocoes: false,
        Endereco: {
          cep: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          complemento: ''
        }
      })
    }
  }, [cliente, open])

  const handleSubmit = e => {
    e.preventDefault()

    const clienteCompleto = {
      nome: formData.nome,
      email: formData.email,
      genero: formData.genero,
      telefone: formData.telefone,
      nascimento: formData.nascimento,
      aceita_promocoes: formData.aceita_promocoes,
      Endereco: {
        cep: formData.Endereco.cep,
        rua: formData.Endereco.rua,
        numero: formData.Endereco.numero,
        bairro: formData.Endereco.bairro,
        cidade: formData.Endereco.cidade,
        estado: formData.Endereco.estado
      }
    }

    onSave(clienteCompleto)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='md'
      fullWidth
    >
      <DialogTitle>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Preencha as informações do cliente. Campos com * são obrigatórios.
        </Typography>

        <Box component='form' onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Stack spacing={2}>
              {/* Nome e Sobrenome */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Nome'
                  value={formData.nome}
                  onChange={e =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </Grid>

              {/* Email e Telefone */}
              <Stack spacing={2} direction={'row'}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='E-mail'
                    type='email'
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Telefone/WhatsApp'
                    value={formData.telefone}
                    onChange={e =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    placeholder='(11) 91234-5678'
                    required
                  />
                </Grid>
              </Stack>
              {/* Genero e Data de Nascimento */}
              <Stack spacing={2} direction={'row'}>
                <Grid item size={8}>
                  <FormControl fullWidth>
                    <InputLabel>Genero</InputLabel>
                    <Select
                      value={formData.genero || ''}
                      onChange={e =>
                        setFormData({ ...formData, genero: e.target.value })
                      }
                      label='Genero'
                    >
                      <MenuItem value=''>
                        <em>Selecione...</em>
                      </MenuItem>
                      <MenuItem value='M'>Masculino</MenuItem>
                      <MenuItem value='F'>Feminino</MenuItem>
                      <MenuItem value='O'>Outro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Data de Nascimento'
                    type='date'
                    value={formData.nascimento}
                    onChange={e =>
                      setFormData({ ...formData, nascimento: e.target.value })
                    }
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Stack>
              {/* Divider de Endereço */}
              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mt: 2, mb: 1 }}>
                  Endereço
                </Typography>
              </Grid>

              {/* CEP, Cidade e Bairro */}
              <Stack spacing={2} direction={'row'}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='CEP'
                    value={formData.Endereco.cep}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        Endereco: {
                          ...formData.Endereco,
                          cep: e.target.value
                        }
                      })
                    }
                    placeholder='00000-000'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='Cidade'
                    value={formData.Endereco.cidade}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        Endereco: {
                          ...formData.Endereco,
                          cidade: e.target.value
                        }
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='Bairro'
                    value={formData.Endereco.bairro}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        Endereco: {
                          ...formData.Endereco,
                          bairro: e.target.value
                        }
                      })
                    }
                  />
                </Grid>
              </Stack>
              {/* Logradouro e Número */}
              <Stack spacing={2} direction={'row'}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label='Logradouro'
                    value={formData.Endereco.rua}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        Endereco: {
                          ...formData.Endereco,
                          rua: e.target.value
                        }
                      })
                    }
                    placeholder='Rua/Av...'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='Número'
                    value={formData.Endereco.numero}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        Endereco: {
                          ...formData.Endereco,
                          numero: e.target.value
                        }
                      })
                    }
                  />
                </Grid>
              </Stack>

              {/* Complemento */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Complemento'
                    value={formData.Endereco.complemento}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        Endereco: {
                          ...formData.Endereco,
                          complemento: e.target.value
                        }
                      })
                    }
                    placeholder='Apto, Bloco, etc'
                  />
                </Grid>
              {/* Autorização de Promoções */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.aceita_promocoes}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          aceita_promocoes: e.target.checked
                        })
                      }
                    />
                  }
                  label='Cliente autoriza receber promoções e notícias por WhatsApp/E-mail'
                />
              </Grid>
            </Stack>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)}>Cancelar</Button>
        <Button onClick={handleSubmit} variant='contained'>
          {cliente ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
