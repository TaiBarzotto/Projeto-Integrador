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

import LoginPage from './Login'
import { Navbar } from './modules/layout/Navbar'
import Fornecedor from './modules/Fornecedor/Fornecedor'
import Cliente from './modules/Cliente/Cliente'

import { Box, Container } from '@mui/material'
//import { Navbar } from './components/layout/Navbar';
//import { Dashboard } from './components/dashboard/Dashboard';
//import { ProdutosPage } from './components/produtos/ProdutosPage';
//import { ClientesPage } from './components/clientes/ClientesPage';
//import { VendasPage } from './components/vendas/VendasPage';
//import { DespesasPage } from './components/despesas/DespesasPage';
//import { CategoriasPage } from './components/categorias/CategoriasPage';
//import { FinanceiroPage } from './components/financeiro/FinanceiroPage';
//import { AlertasPage } from './components/alertas/AlertasPage';
//import { ConfiguracoesPage } from './components/configuracoes/ConfiguracoesPage';

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

          {/* DEFAULT */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
