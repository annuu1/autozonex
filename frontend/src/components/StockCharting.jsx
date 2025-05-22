import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import StockChart from './StockChart';

const StockCharting = () => {
  const [inputTicker, setInputTicker] = useState('ABB');
  const [finalTicker, setFinalTicker] = useState('ABB.NS');
  const [timeFrame, setTimeFrame] = useState('1d');

  // Debounced ticker update (wait 2s after last keystroke)
  const updateTicker = useCallback(
    debounce((value) => {
      const formattedTicker = value.toUpperCase().endsWith('.NS')
        ? value.toUpperCase()
        : `${value.toUpperCase()}.NS`;
      setFinalTicker(formattedTicker);
    }, 2000),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputTicker(value);
    updateTicker(value);
  };

  useEffect(() => {
    return () => {
      updateTicker.cancel(); // clean up debounce on unmount
    };
  }, [updateTicker]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AutozoneX Dashboard</h1>
      <div className="mb-4 flex items-center space-x-4">
        <label>Ticker:</label>
        <input
          type="text"
          value={inputTicker}
          onChange={handleInputChange}
          className="border p-2"
          placeholder="e.g., RELIANCE"
        />
        <label>Time Frame:</label>
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

      {/* Render chart only when finalTicker is set */}
      <StockChart ticker={finalTicker} timeFrame={timeFrame} />
    </div>
  );
};

export default StockCharting;
