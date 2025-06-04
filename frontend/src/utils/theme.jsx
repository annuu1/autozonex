import { createTheme } from '@mui/material/styles';
import { designTokens } from './designTokens';

const theme = createTheme({
  palette: {
    primary: {
      main: designTokens.colors.teal,
      dark: designTokens.colors.darkTeal,
    },
    error: {
      main: designTokens.colors.error,
    },
    success: {
      main: designTokens.colors.success,
    },
    text: {
      primary: designTokens.colors.white,
      secondary: designTokens.colors.lightGray,
    },
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily,
    h4: designTokens.typography.h4,
    body2: designTokens.typography.body2,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: designTokens.colors.glassBg,
            color: designTokens.colors.white,
            '& fieldset': { borderColor: designTokens.colors.inputBorder },
            '&:hover fieldset': { borderColor: designTokens.colors.teal },
            '&.Mui-focused fieldset': { borderColor: designTokens.colors.blue },
          },
          '& .MuiInputLabel-root': { color: designTokens.colors.inputLabel },
          '& .MuiInputLabel-root.Mui-focused': { color: designTokens.colors.blue },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 'bold',
        },
        contained: {
          backgroundColor: designTokens.colors.teal,
          '&:hover': {
            backgroundColor: designTokens.colors.darkTeal,
            transform: 'scale(1.05)',
            transition: 'transform 0.2s ease, background-color 0.3s',
          },
          '&.Mui-disabled': {
            backgroundColor: `rgba(6, 182, 212, 0.5)`,
            color: designTokens.colors.white,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.errorBg,
          color: designTokens.colors.error,
        },
        standardSuccess: {
          backgroundColor: designTokens.colors.successBg,
          color: designTokens.colors.success,
        },
      },
    },
  },
});

export {theme};