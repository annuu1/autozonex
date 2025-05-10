import React, { useState } from 'react';
import StockChart from './components/StockChart';

const App = () => {
  const [ticker, setTicker] = useState('RELIANCE.NS');
  const [timeFrame, setTimeFrame] = useState('1d');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">GTF Trading Dashboard</h1>
      <div className="mb-4">
        <label className="mr-2">Ticker:</label>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="border p-2 mr-4"
          placeholder="e.g., RELIANCE.NS"
        />
        <label className="mr-2">Time Frame:</label>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="border p-2"
        >
          <option value="1d">Daily</option>
          <option value="1wk">Weekly</option>
          <option value="1mo">Monthly</option>
        </select>
      </div>
      <StockChart ticker={ticker} timeFrame={timeFrame} />
    </div>
  );
};

export default App;