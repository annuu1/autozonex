import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCandles = async (ticker, timeFrame) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candles/${ticker}/${timeFrame}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch candlestick data');
  }
};

export const fetchZones = async (ticker, timeFrame) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/zones/${ticker}/${timeFrame}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch demand zones');
  }
};

export const fetchAllZones = async (page, limit, timeFrame='all') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/zones/allZones`, {
      params: { page,limit, timeFrame }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch all demand zones');
  }
};
