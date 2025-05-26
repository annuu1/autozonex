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
import TradeJournal from './pages/tradeJournal/TradeJournal';
import Settings from './pages/settings/Settings';
import TradeBoard from './pages/tradeBoard/TradeBoard';
import AddNote from './components/dialogs/AddNote';
import Note from './pages/note/Note';
import WatchList from './pages/watchList/WatchList';
import Alert from './pages/alert/Alert';
import PriceActions from './pages/priceAction/PriceActions';

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
          path="/tradeboard"
          element={
            <MainLayout>
              <ProtectedRoute>
                <TradeBoard />
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
                <WatchList/>
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            </MainLayout>
          }
        />

      <Route
      path = "/trade-journal"
      element = {
        <MainLayout>
          <ProtectedRoute>
            <TradeJournal />
          </ProtectedRoute>
        </MainLayout>
      }
      />
      <Route
      path = "/notes"
      element = {
        <MainLayout>
          <ProtectedRoute>
            <Note />
          </ProtectedRoute>
        </MainLayout>
      }
      />
      <Route
      path = "/alerts"
      element = {
        <MainLayout>
          <ProtectedRoute>
            <Alert />
          </ProtectedRoute>
        </MainLayout>
      }
      />
      <Route
      path = "/price-actions"
      element = {
        <MainLayout>
          <ProtectedRoute>
            <PriceActions />
          </ProtectedRoute>
        </MainLayout>
      }
      />


      </Routes>
    </Router>
  );
};

export default App;
