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

export function FornecedorDialog ({ open, onOpenChange, fornecedor, onSave }) {
  const [formData, setFormData] = useState({
    nome_pessoa: '',
    email: '',
    nome_da_marca: '',
    telefone: ''
  })

  useEffect(() => {
    if (fornecedor) {
      setFormData(prev => ({
        ...fornecedor
      }))
    } else {
      setFormData({
        nome_pessoa: '',
        email: '',
        nome_da_marca: '',
        telefone: ''
      })
    }
  }, [fornecedor, open])

  const handleSubmit = e => {
    e.preventDefault()

    const fornecedorCompleto = {
      id: fornecedor?.id ?? null,
      nome_pessoa: formData.nome_pessoa,
      email: formData.email,
      nome_da_marca: formData.nome_da_marca,
      telefone: formData.telefone
    }

    onSave(fornecedorCompleto)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth='md'
      fullWidth
    >
      <DialogTitle>{fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Preencha as informações do fornecedor. Campos com * são obrigatórios.
        </Typography>

        <Box component='form' onSubmit={handleSubmit}>
          <Grid container spacing={2}>
              {/* Nome e Sobrenome_pessoa */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Representante'
                  value={formData.nome_pessoa}
                  onChange={e =>
                    setFormData({ ...formData, nome_pessoa: e.target.value })
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
              {/* Nome da Marca */}
              <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Marca'
                    value={formData.nome_da_marca}
                    onChange={e =>
                      setFormData({ ...formData, nome_da_marca: e.target.value })
                    }
                    required
                  />
                </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)}>Cancelar</Button>
        <Button onClick={handleSubmit} variant='contained'>
          {fornecedor ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
