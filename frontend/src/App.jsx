import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Dashboard from './components/Dashboard';
import StockCharting from './components/StockCharting';
import AllZones from './components/AllZones';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import ProtectedRoute from './components/routes/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        {/* App Pages (with sidebar) */}
        <Route
          path="/"
          element={
            <MainLayout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/all-zones"
          element={
            <MainLayout>
              <ProtectedRoute>
                <AllZones />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/chart"
          element={
            <MainLayout>
              <ProtectedRoute>
                <StockCharting ticker="RELIANCE.NS" timeFrame="1d" />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/watchlist"
          element={
            <MainLayout>
              <ProtectedRoute>
                <h1>Watch list</h1>
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <ProtectedRoute>
                <h1>Profile settings</h1>
              </ProtectedRoute>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
