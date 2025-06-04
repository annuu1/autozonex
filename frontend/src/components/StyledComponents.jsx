import { styled } from '@mui/material/styles';
import { Box, Paper, Button } from '@mui/material';
import { designTokens } from '../utils/designTokens';

export const AnimatedBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(45deg, ${designTokens.colors.navyBlue}, ${designTokens.colors.teal}, ${designTokens.colors.blue}, ${designTokens.colors.navyBlue})`,
  backgroundSize: '400%',
  animation: 'gradientShift 15s ease infinite',
  padding: theme.spacing(2),
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

export const GlassCard = styled(Paper)(({ theme }) => ({
  maxWidth: 1200,
  width: '100%',
  padding: theme.spacing(3),
  background: designTokens.colors.glassBg,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  border: `1px solid ${designTokens.colors.glassBorder}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

export const AnimatedButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
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
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius * 1.5,
}));