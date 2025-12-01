import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

import {
  Home,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Receipt,
  FolderTree,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'

export function Navbar ({ usuario, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // página atual pela URL
  const currentPage = location.pathname.replace('/', '')

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'fornecedores', label: 'Fornecedores', icon: Truck, adminOnly: true },
    { id: 'emDev', label: 'Vendas', icon: ShoppingCart },
    { id: 'emDev', label: 'Despesas', icon: Receipt, adminOnly: true },
    {
      id: 'emDev',
      label: 'Categorias',
      icon: FolderTree,
      adminOnly: true
    },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, adminOnly: true }
  ]

  const filteredItems = menuItems.filter(
    item => !item.adminOnly || usuario?.administrador
  )

  const handleNavigate = page => {
    navigate(`/${page}`)
    setMobileMenuOpen(false)
  }

  const handleLogoutClick = () => {
    setMobileMenuOpen(false)
    onLogout()
    navigate('/login')
  }

  return (
    <>
      <AppBar
        position='sticky'
        elevation={1}
        color='text'
        sx={{
          backgroundColor: '#F7F3EF'
        }}
      >
        <Toolbar sx={{ gap: 4, py: 1.5 }}>
          <Typography variant='h6'>Tok Digital</Typography>

          {/* DESKTOP MENU */}
          <Box
            sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}
          >
            {filteredItems.map(item => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'contained' : 'text'}
                  color={currentPage === item.id ? 'primary' : 'inherit'}
                  size='small'
                  startIcon={<Icon size={16} />}
                  onClick={() => handleNavigate(item.id)}
                  sx={{
                    textTransform: 'none',
                    color:
                      currentPage === item.id
                        ? 'primary.contrastText'
                        : 'text.primary'
                  }}
                >
                  {item.label}
                </Button>
              )
            })}
          </Box>

          {/* ÍCONES DIREITA */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              ml: 'auto'
            }}
          >
            <Box sx={{ ml: 2, pl: 2, borderLeft: 1, borderColor: 'divider' }}>
              <Typography variant='body2'>{usuario?.nome}</Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ textTransform: 'capitalize' }}
              >
                {usuario?.administrador ? 'Administrador' : 'Vendedor'}

              </Typography>
            </Box>

            <IconButton size='small' onClick={handleLogoutClick} color='error'>
              <LogOut size={20} />
            </IconButton>
          </Box>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor='right'
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' }
        }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant='body2'>{usuario?.nome}</Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ textTransform: 'capitalize' }}
          >
            {usuario?.administrador ? 'Administrador' : 'Vendedor'}

          </Typography>

          <List sx={{ mt: 2 }}>
            {filteredItems.map(item => {
              const Icon = item.icon
              return (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={currentPage === item.id}
                    onClick={() => handleNavigate(item.id)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon size={20} />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogoutClick}>
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogOut size={20} />
                </ListItemIcon>
                <ListItemText primary='Sair' sx={{ color: 'error.main' }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}
