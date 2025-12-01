import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { User, ShieldCheck, Store, ArrowRight } from 'lucide-react'

export default function HomePage () {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Pega o usuário do localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const isAdmin = currentUser?.administrador

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Card de Boas-vindas */}
      <Card
        sx={{
          backgroundColor: 'verde.clarinho',
          mb: 4
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3} alignItems='center' textAlign='center'>
            {/* Ícone */}
            <Box
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              {isAdmin ? (
                <ShieldCheck size={isMobile ? 40 : 50} color='white' />
              ) : (
                <User size={isMobile ? 40 : 50} color='white' />
              )}
            </Box>

            {/* Mensagem de Boas-vindas */}
            <Box>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                fontWeight='bold'
                color='#0A0A0A'
                gutterBottom
              >
                Olá {currentUser?.nome || 'Usuário'}, bem-vindo ao Tok Digital
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 2
                }}
              >
                <Typography variant='body1' color='text.secondary'>
                  Seu acesso é de
                </Typography>
                <Chip
                  label={isAdmin ? 'Administrador' : 'Vendedor'}
                  color={isAdmin ? 'verde.escuro' : 'verde.menos_claro'}
                  icon={
                    isAdmin ? <ShieldCheck size={16} /> : <Store size={16} />
                  }
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Box>

            {/* Instruções */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <Typography variant='body2' color='text.secondary'>
                Use a navbar para navegar pelo sistema
              </Typography>
              <ArrowRight size={18} color={theme.palette.text.secondary} />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Cards de Informação Rápida (Opcional) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 2,
          mb: 3
        }}
      >
        <Card sx={{ backgroundColor: 'verde.clarinho' }}>
          <CardContent>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Nome
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {currentUser?.nome || '-'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'verde.clarinho' }}>
          <CardContent>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Email
            </Typography>
            <Typography
              variant='h6'
              fontWeight='bold'
              sx={{ wordBreak: 'break-word' }}
            >
              {currentUser?.email || '-'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'verde.clarinho' }}>
          <CardContent>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Tipo de Acesso
            </Typography>
            <Chip
              label={isAdmin ? 'Administrador' : 'Vendedor'}
              color={isAdmin ? 'verde.escuro' : 'verde.menos_claro'}
              size='medium'
            />
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'verde.clarinho' }}>
          <CardContent>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Sistema
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              Tok Digital
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
