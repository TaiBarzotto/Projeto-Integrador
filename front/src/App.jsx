import { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { muiTheme } from './theme/mui-theme'
import CssBaseline from '@mui/material/CssBaseline'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import LoginPage from './modules/Geral/Login'
import { Navbar } from './modules/layout/Navbar'
import Fornecedor from './modules/Fornecedor/Fornecedor'
import Cliente from './modules/Cliente/Cliente'
import Produto from './modules/Produto/Produto'
import EmDev from './modules/Geral/EmDev'
import HomePage from './modules/Geral/Home'

import { Box, Container } from '@mui/material'

function LayoutProtegido ({ usuario, onLogout, children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar usuario={usuario} onLogout={onLogout} />

      <Container maxWidth='xl' sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  )
}

function App () {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('usuario')
    if (savedUser) setUsuario(JSON.parse(savedUser))
  }, [])

  const handleLogin = usuarioLogado => {
    setUsuario(usuarioLogado)
  }

  const handleLogout = () => {
    setUsuario(null)
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <Router>
        <Routes>
          {/* LOGIN */}
          <Route path='/login' element={<LoginPage onLogin={handleLogin} />} />

          {/* ROTAS PROTEGIDAS */}
          <Route
            path='/home'
            element={
              usuario ? (
                <LayoutProtegido usuario={usuario} onLogout={handleLogout}>
                  <HomePage usuario={usuario} />
                </LayoutProtegido>
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />

          <Route
            path='/fornecedores'
            element={
              usuario ? (
                <LayoutProtegido usuario={usuario} onLogout={handleLogout}>
                  <Fornecedor usuario={usuario} />
                </LayoutProtegido>
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />

          <Route
            path='/clientes'
            element={
              usuario ? (
                <LayoutProtegido usuario={usuario} onLogout={handleLogout}>
                  <Cliente usuario={usuario} />
                </LayoutProtegido>
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />

          <Route
            path='/produtos'
            element={
              usuario ? (
                <LayoutProtegido usuario={usuario} onLogout={handleLogout}>
                  <Produto usuario={usuario} />
                </LayoutProtegido>
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />

          <Route
            path='/emDev'
            element={
              usuario ? (
                <LayoutProtegido usuario={usuario} onLogout={handleLogout}>
                  <EmDev />
                </LayoutProtegido>
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
          {/* DEFAULT */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
