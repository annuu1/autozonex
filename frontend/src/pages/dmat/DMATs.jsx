import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DMATs = () => {
  // State for form inputs and API responses
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewToken, setViewToken] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [userId, setUserId] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [holdings, setHoldings] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [orderBook, setOrderBook] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [newOrder, setNewOrder] = useState({
    symbol: '',
    quantity: '',
    price: '',
    transactionType: 'BUY',
    orderType: 'LIMIT',
  });
  const [step, setStep] = useState(1); // 1: Login, 2: OTP, 3: Dashboard
  const [activeTab, setActiveTab] = useState('holdings'); // Dashboard tabs

  // Access token from environment variable
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

  // Local storage keys
  const STORAGE_KEY = 'kotak_securities_session';
  const EXPIRATION_DAYS = 1;

  // Check local storage on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      const { sessionToken, sessionId, expiry } = JSON.parse(savedSession);
      if (expiry > Date.now()) {
        setSessionToken(sessionToken);
        setSessionId(sessionId);
        setStep(3); // Skip to dashboard
        fetchHoldings(sessionToken, sessionId);
        fetchPortfolioSummary(sessionToken, sessionId);
        fetchOrderBook(sessionToken, sessionId);
        fetchPositions(sessionToken, sessionId);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save session to local storage
  const saveSessionToStorage = (token, sid) => {
    const expiry = Date.now() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const sessionData = { sessionToken, sessionId: sid, expiry };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  };

  // Decode JWT to extract userId
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload).sub;
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  };

  // Step 1: Generate View Token
  const handleGenerateViewToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate',
        {
          mobileNumber: `+91${mobileNumber}`,
          password,
        },
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: ACCESS_TOKEN,
          },
        }
      );

      const { token, sid, isUserPwdExpired } = response.data.data;

      if (isUserPwdExpired) {
        setError('Your password has expired. Please update your trade password.');
        setIsLoading(false);
        return;
      }

      setViewToken(token);
      setSessionId(sid);

      const decodedUserId = decodeJWT(token);
      if (decodedUserId) {
        setUserId(decodedUserId);
        await handleGenerateOTP(decodedUserId);
        setStep(2); // Move to OTP input step
      } else {
        setError('Failed to decode user ID from token.');
      }
    } catch (err) {
      setError('Error generating view token: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Generate OTP
  const handleGenerateOTP = async (userId) => {
    try {
      await axios.post(
        'https://gw-napi.kotaksecurities.com/login/1.0/login/otp/generate',
        {
          userId,
          sendEmail: true,
          isWhitelisted: true,
        },
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: ACCESS_TOKEN,
          },
        }
      );

      alert('OTP has been sent to your registered mobile number and email address.');
    } catch (err) {
      setError('Error generating OTP: ' + (err.response?.data?.message || err.message));
      throw err;
    }
  };

  // Step 3: Generate Session Token
  const handleGenerateSessionToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate',
        {
          userId,
          otp,
        },
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: ACCESS_TOKEN,
            sid: sessionId,
            Auth: viewToken,
          },
        }
      );

      const { token, sid } = response.data.data;
      setSessionToken(token);
      setSessionId(sid);
      saveSessionToStorage(token, sid);
      await Promise.all([
        fetchHoldings(token, sid),
        fetchPortfolioSummary(token, sid),
        fetchOrderBook(token, sid),
        fetchPositions(token, sid),
      ]);
      setStep(3); // Move to dashboard
    } catch (err) {
      setError('Error generating session token: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Portfolio Holdings
  const fetchHoldings = async (token, sid) => {
    try {
      const response = await axios.get(
        'https://gw-napi.kotaksecurities.com/Portfolio/1.0/portfolio/v1/holdings?alt=false',
        {
          headers: {
            accept: '*/*',
            Authorization: ACCESS_TOKEN,
            sid,
            Auth: token,
          },
        }
      );
      setHoldings(response.data.data || []);
    } catch (err) {
      handleApiError(err, 'fetching holdings');
    }
  };

  // Fetch Portfolio Summary
  const fetchPortfolioSummary = async (token, sid) => {
    try {
      const response = await axios.get(
        'https://gw-napi.kotaksecurities.com/Portfolio/1.0/portfolio/v1/summary?alt=false',
        {
          headers: {
            accept: '*/*',
            Authorization: ACCESS_TOKEN,
            sid,
            Auth: token,
          },
        }
      );
      setPortfolioSummary(response.data.data || null);
    } catch (err) {
      handleApiError(err, 'fetching portfolio summary');
    }
  };

  // Fetch Order Book
  const fetchOrderBook = async (token, sid) => {
    try {
      const response = await axios.get(
        'https://gw-napi.kotaksecurities.com/order/2.0/orderBook',
        {
          headers: {
            accept: '*/*',
            Authorization: ACCESS_TOKEN,
            sid,
            Auth: token,
          },
        }
      );
      setOrderBook(response.data.data || []);
    } catch (err) {
      handleApiError(err, 'fetching order book');
    }
  };

  // Fetch Positions
  const fetchPositions = async (token, sid) => {
    try {
      const response = await axios.get(
        'https://gw-napi.kotaksecurities.com/position/2.0/positions?type=ALL',
        {
          headers: {
            accept: '*/*',
            Authorization: ACCESS_TOKEN,
            sid,
            Auth: token,
          },
        }
      );
      setPositions(response.data.data || []);
    } catch (err) {
      handleApiError(err, 'fetching positions');
    }
  };

  // Fetch Order Status
  const fetchOrderStatus = async (orderId) => {
    try {
      const response = await axios.get(
        `https://gw-napi.kotaksecurities.com/order/2.0/status?orderId=${orderId}`,
        {
          headers: {
            accept: '*/*',
            Authorization: ACCESS_TOKEN,
            sid: sessionId,
            Auth: sessionToken,
          },
        }
      );
      setOrderStatus(response.data.data || null);
    } catch (err) {
      handleApiError(err, 'fetching order status');
    }
  };

  // Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://gw-napi.kotaksecurities.com/order/2.0/place',
        {
          symbol: newOrder.symbol,
          quantity: parseInt(newOrder.quantity),
          price: parseFloat(newOrder.price),
          transactionType: newOrder.transactionType,
          orderType: newOrder.orderType,
          product: 'DELIVERY', // Default product; adjust based on requirements
          validity: 'GFD', // Good For Day; adjust as needed
        },
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: ACCESS_TOKEN,
            sid: sessionId,
            Auth: sessionToken,
          },
        }
      );

      alert('Order placed successfully! Order ID: ' + response.data.data.orderId);
      setNewOrder({ symbol: '', quantity: '', price: '', transactionType: 'BUY', orderType: 'LIMIT' });
      await fetchOrderBook(sessionToken, sessionId); // Refresh order book
      await fetchOrderStatus(response.data.data.orderId); // Fetch status of new order
    } catch (err) {
      setError('Error placing order: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API errors and session expiration
  const handleApiError = (err, context) => {
    const message = `Error ${context}: ${err.response?.data?.message || err.message}`;
    setError(message);
    if (err.response?.status === 401 || err.response?.data?.message?.includes('Invalid Token')) {
      localStorage.removeItem(STORAGE_KEY);
      setSessionToken('');
      setSessionId('');
      setStep(1);
      setError('Session expired or invalid. Please log in again.');
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSessionToken('');
    setSessionId('');
    setHoldings([]);
    setPortfolioSummary(null);
    setOrderBook([]);
    setPositions([]);
    setOrderStatus(null);
    setViewToken('');
    setUserId('');
    setOtp('');
    setMobileNumber('');
    setPassword('');
    setStep(1);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Kotak Securities Dashboard</h1>

      {/* Step 1: Login Form */}
      {step === 1 && (
        <form onSubmit={handleGenerateViewToken} className="space-y-4">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number (without +91)
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              pattern="[0-9]{10}"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Login and Request OTP'}
          </button>
        </form>
      )}

      {/* Step 2: OTP Form */}
      {step === 2 && (
        <form onSubmit={handleGenerateSessionToken} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP received"
              maxLength="6"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {/* Step 3: Dashboard with Tabs */}
      {step === 3 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Trading Dashboard</h2>
            <button
              onClick={handleLogout}
              className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            {['holdings', 'summary', 'orders', 'positions', 'orderStatus'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('orderStatus', 'Order Status')}
              </button>
            ))}
          </div>

          {/* Holdings Tab */}
          {activeTab === 'holdings' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Portfolio Holdings</h3>
              {holdings.length > 0 ? (
                <div className="space-y-4">
                  {holdings.map((holding, index) => (
                    <div key={index} className="p-4 border rounded-md bg-gray-50">
                      <p><strong>Symbol:</strong> {holding.symbol || 'N/A'}</p>
                      <p><strong>Quantity:</strong> {holding.quantity || 'N/A'}</p>
                      <p><strong>Average Price:</strong> {holding.avgPrice || 'N/A'}</p>
                      <p><strong>Current Value:</strong> {holding.currentValue || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No holdings found.</p>
              )}
            </div>
          )}

          {/* Portfolio Summary Tab */}
          {activeTab === 'summary' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Portfolio Summary</h3>
              {portfolioSummary ? (
                <div className="p-4 border rounded-md bg-gray-50">
                  <p><strong>Total Value:</strong> {portfolioSummary.totalValue || 'N/A'}</p>
                  <p><strong>Invested Value:</strong> {portfolioSummary.investedValue || 'N/A'}</p>
                  <p><strong>Unrealized P&L:</strong> {portfolioSummary.unrealizedPnL || 'N/A'}</p>
                </div>
              ) : (
                <p className="text-gray-500">No summary data available.</p>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Place New Order</h3>
              <form onSubmit={handlePlaceOrder} className="space-y-4 mb-6">
                <div>
                  <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                    Symbol
                  </label>
                  <input
                    type="text"
                    id="symbol"
                    value={newOrder.symbol}
                    onChange={(e) => setNewOrder({ ...newOrder, symbol: e.target.value })}
                    placeholder="Enter stock symbol"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={newOrder.price}
                    onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                    placeholder="Enter price"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">
                    Transaction Type
                  </label>
                  <select
                    id="transactionType"
                    value={newOrder.transactionType}
                    onChange={(e) => setNewOrder({ ...newOrder, transactionType: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="BUY">Buy</option>
                    <option value="SELL">Sell</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                    Order Type
                  </label>
                  <select
                    id="orderType"
                    value={newOrder.orderType}
                    onChange={(e) => setNewOrder({ ...newOrder, orderType: e.target.value })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="LIMIT">Limit</option>
                    <option value="MARKET">Market</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-md text-white ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
              <h3 className="text-lg font-semibold mb-2">Order Book</h3>
              {orderBook.length > 0 ? (
                <div className="space-y-4">
                  {orderBook.map((order, index) => (
                    <div key={index} className="p-4 border rounded-md bg-gray-50">
                      <p><strong>Order ID:</strong> {order.orderId || 'N/A'}</p>
                      <p><strong>Symbol:</strong> {order.symbol || 'N/A'}</p>
                      <p><strong>Quantity:</strong> {order.quantity || 'N/A'}</p>
                      <p><strong>Price:</strong> {order.price || 'N/A'}</p>
                      <p><strong>Status:</strong> {order.status || 'N/A'}</p>
                      <button
                        onClick={() => fetchOrderStatus(order.orderId)}
                        className="mt-2 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Check Status
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No orders found.</p>
              )}
            </div>
          )}

          {/* Positions Tab */}
          {activeTab === 'positions' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Positions</h3>
              {positions.length > 0 ? (
                <div className="space-y-4">
                  {positions.map((position, index) => (
                    <div key={index} className="p-4 border rounded-md bg-gray-50">
                      <p><strong>Symbol:</strong> {position.symbol || 'N/A'}</p>
                      <p><strong>Quantity:</strong> {position.quantity || 'N/A'}</p>
                      <p><strong>Average Price:</strong> {position.avgPrice || 'N/A'}</p>
                      <p><strong>P&L:</strong> {position.pnl || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No positions found.</p>
              )}
            </div>
          )}

          {/* Order Status Tab */}
          {activeTab === 'orderStatus' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Status</h3>
              {orderStatus ? (
                <div className="p-4 border rounded-md bg-gray-50">
                  <p><strong>Order ID:</strong> {orderStatus.orderId || 'N/A'}</p>
                  <p><strong>Symbol:</strong> {orderStatus.symbol || 'N/A'}</p>
                  <p><strong>Status:</strong> {orderStatus.status || 'N/A'}</p>
                  <p><strong>Quantity:</strong> {orderStatus.quantity || 'N/A'}</p>
                  <p><strong>Price:</strong> {orderStatus.price || 'N/A'}</p>
                </div>
              ) : (
                <p className="text-gray-500">No order status available. Check an order from the Orders tab.</p>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default DMATs;