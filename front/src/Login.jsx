import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Avatar,
  Container,
  Paper,
  Chip
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AccountCircleIcon,
  ShoppingBag,
  Email,
  Lock
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

export default function LoginPage ({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const usuarios = [
    {
      id: '1',
      nome: 'Admin User',
      email: 'admin@loja.com',
      senha: 'admin123',
      role: 'administrador'
    },
    {
      id: '2',
      nome: 'Vendedor Silva',
      email: 'vendedor@loja.com',
      senha: 'vend123',
      role: 'vendedor'
    }
  ]

  const handleSubmit = e => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    setTimeout(() => {
      const usuario = usuarios.find(u => u.email === email && u.senha === senha)
      if (usuario) {
        localStorage.setItem('user', JSON.stringify(usuario))
        onLogin(usuario)
        navigate('/produtos')
      } else {
        setErro('Email ou senha incorretos')
      }
      setCarregando(false)
    }, 800)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #A8B788 0%, #F7F3EF 100%)',
        p: 2
      }}
    >
      <Container maxWidth='sm'>
        {/* Logo e Título */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.contrastText',
              color: 'primary.main'
            }}
          >
            <AccountCircleOutlinedIcon sx={{ fontSize: 80 }} />
          </Avatar>
          <Typography
            variant='h1'
            sx={{
              color: 'primary.contrastText',
              fontWeight: 1000,
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Tok Digital
          </Typography>
        </Box>

        {/* Card de Login */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              p: 3,
              color: 'primary.contrastText'
            }}
          >
            <Typography variant='h5' fontWeight={600}>
              Entrar no Sistema
            </Typography>
            <Typography variant='body2' sx={{ opacity: 0.9, mt: 0.5 }}>
              Digite suas credenciais para acessar
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label='Email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete='email'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Email color='action' />
                      </InputAdornment>
                    )
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label='Senha'
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  autoComplete='current-password'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Lock color='action' />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                          edge='end'
                        >
                          {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {erro && (
                <Alert severity='error' sx={{ mb: 3 }}>
                  {erro}
                </Alert>
              )}

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={carregando}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 3,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light'
                  }
                }}
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <Paper
              variant='outlined'
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'grey.50',
                borderStyle: 'dashed'
              }}
            >
              <Typography
                variant='caption'
                component='div'
                color='text.secondary'
                sx={{ textAlign: 'center' }}
              >
                <Box sx={{ mb: 0.5 }}>
                  <strong>Administrador:</strong> admin@loja.com / admin123
                </Box>
                <Box>
                  <strong>Vendedor:</strong> vendedor@loja.com / vend123
                </Box>
              </Typography>
            </Paper>
          </CardContent>
        </Paper>

        <Typography
          variant='body2'
          sx={{
            textAlign: 'center',
            mt: 3,
            color: '#000000'
          }}
        >
          © 2025 Tok Digital
        </Typography>
      </Container>
    </Box>
  )
}
