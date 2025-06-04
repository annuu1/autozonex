import { useState } from 'react';
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
  '&.Mui-disabled': {
    backgroundColor: 'rgba(6, 182, 212, 0.5)', // Faded teal when disabled
    color: '#ffffff',
  },
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius * 1.5,
}));

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.name || !form.phone || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (!/.+\@.+\..+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Signup failed.');
      } else {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
          Create Account
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: '#e5e7eb', mb: 3 }}
        >
          Join our trading platform today
        </Typography>

        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 2, background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
            {error}
          </Alert>
        </Fade>
        <Fade in={!!success}>
          <Alert severity="success" sx={{ mb: 2, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
            {success}
          </Alert>
        </Fade>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'phone', label: 'Phone', type: 'tel' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: 'password' },
            { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
          ].map((field) => (
            <TextField
              key={field.name}
              id={field.name}
              label={field.label}
              type={field.type}
              variant="outlined"
              fullWidth
              required
              value={form[field.name]}
              onChange={handleChange}
              name={field.name}
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
          ))}

          <AnimatedButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} sx={{ color: '#ffffff' }} />}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </AnimatedButton>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#e5e7eb' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              sx={{
                color: '#06b6d4',
                fontWeight: 'medium',
                '&:hover': { textDecoration: 'underline', color: '#3b82f6' },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </GlassCard>
    </AnimatedBackground>
  );
};

export default Signup;