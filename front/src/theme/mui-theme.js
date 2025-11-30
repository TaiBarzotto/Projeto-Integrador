import { createTheme } from '@mui/material/styles'
import { COLORS } from '../lib/colors'
import { Bold } from 'lucide-react'

// Criar tema customizado do Material-UI baseado nas cores do sistema
export const muiTheme = createTheme({
  palette: {
    verde: {
      clarinho: '#E2E5DE',
      menos_claro: '#C2C3A8'
    },
    primary: {
      main: COLORS.FOREGROUND, // #C2C3A8
      light: '#C2C3A8',
      dark: '#b4b596',
      contrastText: '#ffffff'
    },
    secondary: {
      main: COLORS.MUTED_FOREGROUND, // #717182
      light: '#9e9eae',
      dark: '#505059',
      contrastText: '#ffffff'
    },
    success: {
      main: COLORS.SUCCESS, // #10b981
      light: COLORS.SUCCESS_LIGHT,
      dark: '#059669',
      contrastText: '#ffffff'
    },
    error: {
      main: COLORS.ERROR, // #ef4444
      light: COLORS.ERROR_LIGHT,
      dark: '#dc2626',
      contrastText: '#ffffff'
    },
    warning: {
      main: COLORS.WARNING, // #f59e0b
      light: COLORS.WARNING_LIGHT,
      dark: '#d97706',
      contrastText: '#ffffff'
    },
    info: {
      main: COLORS.INFO, // #3b82f6
      light: COLORS.INFO_LIGHT,
      dark: '#2563eb',
      contrastText: '#ffffff'
    },
    background: {
      default: COLORS.BACKGROUND,
      paper: COLORS.BACKGROUND,
      login: 'linear-gradient(135deg, #A8B788 0%, #F7F3EF 100%)'
    },
    text: {
      primary: '#505059',
      secondary: COLORS.MUTED_FOREGROUND
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    fontSize: 16,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'none' // Desabilita uppercase automático
    }
  },
  shape: {
    borderRadius: 10 // 0.625rem = 10px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        contained: {
          '&:hover': {
            opacity: 0.9
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: COLORS.BACKGROUND,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            }
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${COLORS.BORDER}`
        },
        head: {
          fontWeight: 'Bold'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.28) !important'
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.40) !important'
          }
        }
      }
    }
  }
})
