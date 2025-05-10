import React from 'react';
import StockChart from '../components/StockChart';

const Dashboard = () => {
  const sampleData = [
    { date: '2023-01-01', close: 100 },
    { date: '2023-01-02', close: 102 }
  ];

  return (
    <div>
      <h1>GTF Trading Dashboard</h1>
      <StockChart data={sampleData} />
    </div>
  );
};

export default Dashboard;
