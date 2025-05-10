import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import styled from 'styled-components';

const AppContainer = styled.div;

function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;
