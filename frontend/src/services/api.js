import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchCandles = async (ticker, timeFrame) => {
  try {
    if(timeFrame === '1d' || timeFrame === '1wk' || timeFrame === '1mo'){
      const response = await axios.get(`${API_BASE_URL}/candles/${ticker}/${timeFrame}`);
    return response.data;
    }else{
      const response = await axios.get(`${API_BASE_URL}/candles/${ticker}/${timeFrame}/ltf`);
    return response.data;
    }
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
