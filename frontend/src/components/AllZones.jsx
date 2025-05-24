import React, { useState, useEffect } from 'react';
import { fetchAllZones } from '../services/api';
import StockChart from './StockChart';
import { formatDate } from '../utils/formatDate';
import { formatNumber } from '../utils/formatNumber';
import { getDailyDemandZones } from '../api/zone';

const AllZones = () => {
  const [ticker, setTicker] = useState('RELIANCE.NS');
  const [timeFrame, setTimeFrame] = useState('1d');
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('tradeScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);

  const [targetDate, setTargetDate] = useState('');


  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadZones = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllZones(page, limit);
        console.log('Fetched zones:', data);
        setZones(data.data);
        setTotalPages(data.pages);
      } catch (err) {
        console.error('Error fetching zones:', err);
        setError(err.message || 'Failed to load zones');
      } finally {
        setLoading(false);
      }
    };

    loadZones();
  }, [page, limit]);

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

  const handleSort = key => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };


  const handleFetchDemandZones = async () => {
    if (!targetDate) {
      alert('Please select a target date');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      const data = await getDailyDemandZones(targetDate);
      console.log('Fetched daily demand zones:', data);
      setZones(data);
      setPage(1);
      setTotalPages(1);
    } catch (err) {
      console.error('Error fetching daily demand zones:', err);
      setError(err.message || 'Failed to load daily demand zones');
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AutozoneX Dashboard</h1>

      <div className="flex gap-4 mb-4">
  <input
    type="date"
    value={targetDate}
    onChange={(e) => setTargetDate(e.target.value)}
    className="border p-2 rounded"
  />
  <button
    onClick={handleFetchDemandZones}
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
  >
    Fetch Demand Zones
  </button>
</div>


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

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Chart */}
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

export default AllZones;
