import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, CircularProgress, Alert, Link, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Keyframe animation for the background gradient
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled container for the animated background
const AnimatedBackground = styled(Box)(({ theme }) => ({
  minWidth: '100vw',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #1e3a8a, #06b6d4, #3b82f6, #1e3a8a)', // Navy blue to teal to blue
  backgroundSize: '400%',
  animation: `${gradientShift} 15s ease infinite`,
  padding: theme.spacing(2),
}));

// Styled Paper for glassmorphism effect
const GlassCard = styled(Paper)(({ theme }) => ({
  maxWidth: 460,
  width: '100%',
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

// Styled Button with hover animation
const AnimatedButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  backgroundColor: '#06b6d4', // Teal
  '&:hover': {
    backgroundColor: '#0891b2', // Darker teal
    transform: 'scale(1.05)',
    transition: 'transform 0.2s ease, background-color 0.3s',
  },
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius * 1.5,
}));

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <GlassCard elevation={0}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{ fontWeight: 'bold', color: '#ffffff', mb: 2 }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: '#e5e7eb', mb: 3 }}
        >
          Sign in to access your trading dashboard
        </Typography>

        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 2, background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
            {error}
          </Alert>
        </Fade>

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: '#06b6d4' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
            }}
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: '#06b6d4' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
            }}
          />

          <AnimatedButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} sx={{ color: '#ffffff' }} />}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </AnimatedButton>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#e5e7eb' }}>
            Don’t have an account?{' '}
            <Link
              href="/signup"
              sx={{
                color: '#06b6d4',
                fontWeight: 'medium',
                '&:hover': { textDecoration: 'underline', color: '#3b82f6' },
              }}
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </GlassCard>
    </AnimatedBackground>
  );
};

export default Login;