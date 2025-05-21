import React, { useState, useEffect } from 'react';
import { fetchZones } from '../services/api';
import StockChart from './StockChart';
import { formatNumber } from '../utils/formatNumber';
import { formatDate } from '../utils/formatDate';

const Dashboard = () => {
  const [ticker, setTicker] = useState('RELIANCE.NS');
  const [timeFrame, setTimeFrame] = useState('1d');
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('tradeScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const loadZones = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchZones(ticker, timeFrame);
        console.log('Fetched zones:', data);
        setZones(data);
      } catch (err) {
        console.error('Error fetching zones:', err);
        setError(err.message || 'Failed to load zones');
      } finally {
        setLoading(false);
      }
    };

    loadZones();
  }, [ticker, timeFrame]);

  // Sort and filter zones
  const sortedZones = [...zones]
    .filter(zone => filterType === 'all' || zone.type === filterType)
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'tradeScore') {
        return (a.tradeScore - b.tradeScore) * order;
      }
      if (sortBy === 'legOutDate') {
        return (new Date(a.legOutDate) - new Date(b.legOutDate)) * order;
      }
      return 0;
    });

  // Handle sorting
  const handleSort = key => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AutozoneX Dashboard</h1>

      {/* Inputs */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div>
          <label className="mr-2">Ticker:</label>
          <input
            type="text"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            className="border p-2 rounded"
            placeholder="e.g., RELIANCE.NS"
          />
        </div>
        <div>
          <label className="mr-2">Time Frame:</label>
          <select
            value={timeFrame}
            onChange={e => setTimeFrame(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="1d">Daily</option>
            <option value="1wk">Weekly</option>
            <option value="1mo">Monthly</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Zone Type:</label>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="demand">Demand</option>
            <option value="supply">Supply</option>
          </select>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {/* Zones Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border cursor-pointer" onClick={() => handleSort('ticker')}>
                Ticker {sortBy === 'ticker' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-2 border">Time Frame</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Pattern</th>
              <th className="p-2 border">Proximal Line</th>
              <th className="p-2 border">Distal Line</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort('tradeScore')}>
                Trade Score {sortBy === 'tradeScore' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort('legOutDate')}>
                Leg Out Date {sortBy === 'legOutDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedZones.map((zone, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border">{zone.ticker}</td>
                <td className="p-2 border">{zone.timeFrame}</td>
                <td className="p-2 border">{zone.type}</td>
                <td className="p-2 border">{zone.pattern}</td>
                <td className="p-2 border">{formatNumber(zone.proximalLine)}</td>
                <td className="p-2 border">{formatNumber(zone.distalLine)}</td>
                <td className="p-2 border">{zone.tradeScore}</td>
                <td className="p-2 border">{formatDate(zone.legOutDate)}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => setSelectedZone(zone)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    View Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart for Selected Zone */}
      {selectedZone && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Chart for {selectedZone.ticker} ({selectedZone.timeFrame})
          </h2>
          <StockChart ticker={selectedZone.ticker} timeFrame={selectedZone.timeFrame} selectedZone={selectedZone} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;