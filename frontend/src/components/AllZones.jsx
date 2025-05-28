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
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left List Section */}
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto p-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">Zones</h2>
        <div className="mb-4 flex gap-2">
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleFetchDemandZones}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Fetch
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
        <ul className="space-y-2">
          {sortedZones.map((zone, idx) => (
            <li
              key={zone._id || idx}
              className={`p-3 rounded-lg cursor-pointer flex flex-col transition ${selectedZone?._id === zone._id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
              onClick={() => setSelectedZone(zone)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{zone.ticker}</span>
                <span className="ml-2 text-xs text-gray-500">{zone.timeFrame}</span>
                <span className="ml-2 text-xs text-gray-600">{zone.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-700">Score: {zone.tradeScore}</span>
                <span className="text-xs text-gray-700">{formatDate(zone.legOutDate)}</span>
              </div>
            </li>
          ))}
        </ul>
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
      </div>
      {/* Right Detail Section */}
      <div className="w-2/3 overflow-y-auto p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">AutozoneX Dashboard</h1>
        {selectedZone ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Zone Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Ticker:</strong> {selectedZone.ticker}</div>
                <div><strong>Time Frame:</strong> {selectedZone.timeFrame}</div>
                <div><strong>Type:</strong> {selectedZone.type}</div>
                <div><strong>Pattern:</strong> {selectedZone.pattern}</div>
                <div><strong>Proximal Line:</strong> {formatNumber(selectedZone.proximalLine)}</div>
                <div><strong>Distal Line:</strong> {formatNumber(selectedZone.distalLine)}</div>
                <div><strong>Trade Score:</strong> {selectedZone.tradeScore}</div>
                <div><strong>Leg Out Date:</strong> {formatDate(selectedZone.legOutDate)}</div>
                <div><strong>Created:</strong> {selectedZone.createdAt ? formatDate(selectedZone.createdAt) : '-'}</div>
                <div><strong>Updated:</strong> {selectedZone.updatedAt ? formatDate(selectedZone.updatedAt) : '-'}</div>
              </div>
            </div>
            {/* Chart at the bottom */}
            <div className="mt-auto">
              <h2 className="text-xl font-bold mb-4">
                Chart for {selectedZone.ticker} ({selectedZone.timeFrame})
              </h2>
              <StockChart ticker={selectedZone.ticker} timeFrame={selectedZone.timeFrame} selectedZone={selectedZone} />
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-lg flex items-center justify-center h-full">Select a zone to view details and chart.</div>
        )}
      </div>
    </div>
  );
};

export default AllZones;
