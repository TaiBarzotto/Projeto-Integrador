import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material'
import { Wrench } from 'lucide-react'

export default function EmDesenvolvimento() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh'
      }}
    >
      <Card
        sx={{
          backgroundColor: 'verde.clarinho',
          maxWidth: 500,
          width: '100%'
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            p: { xs: 3, md: 5 }
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.9
            }}
          >
            <Wrench size={40} color='white' />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='h4'
              fontWeight='bold'
              color='#0A0A0A'
              gutterBottom
            >
              Em Desenvolvimento
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Funcionalidade será implementada futuramente ;)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}