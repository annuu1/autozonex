import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'phone', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === 'confirmPassword' ? 'Confirm Password' : field}
              </label>
              <input
                id={field}
                type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded text-center">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded text-center">{success}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md transition-colors ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
