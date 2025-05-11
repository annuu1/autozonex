import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StockChart from './components/StockChart';
import StockCharting from './components/StockCharting';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 sm:ml-64 p-4 bg-gray-100">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chart" element={<StockCharting ticker="RELIANCE.NS" timeFrame="1d" />} />
            <Route path="/watchlist" element={<div>Watchlist (TBD)</div>} />
            <Route path="/settings" element={<div>Settings (TBD)</div>} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;