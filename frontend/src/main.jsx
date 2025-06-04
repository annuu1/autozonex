import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from '@mui/material'
import { theme } from './utils/theme'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
</AuthProvider>
)
