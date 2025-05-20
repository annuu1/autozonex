import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Dashboard from './components/Dashboard';
import StockCharting from './components/StockCharting';
import AllZones from './components/AllZones';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';

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
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/all-zones"
          element={
            <MainLayout>
              <AllZones />
            </MainLayout>
          }
        />
        <Route
          path="/chart"
          element={
            <MainLayout>
              <StockCharting ticker="RELIANCE.NS" timeFrame="1d" />
            </MainLayout>
          }
        />
        <Route
        path='/watchlist'
        element={
          <MainLayout>
            <h1>Watch list</h1>
          </MainLayout>
        }
        />
        <Route
        path='/settings'
        element={
          <MainLayout>
            <h1>Profile settings</h1>
          </MainLayout>
        }
        />
      </Routes>
    </Router>
  );
};

export default App;
