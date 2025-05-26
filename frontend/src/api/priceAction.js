import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "";

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

const getAllPriceActions = async () => {
  try {
    const response = await axios.get(`${API_URL}/priceActions`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price actions:', error);
    throw error;
  }
};

const getPriceAction = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/priceActions/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching price action with id ${id}:`, error);
    throw error;
  }
};

const createPriceAction = async (priceActionData) => {
  try {
    const response = await axios.post(`${API_URL}/priceActions`, priceActionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating price action:', error);
    throw error;
  }
};

const updatePriceAction = async (id, priceActionData) => {
  try {
    const response = await axios.put(`${API_URL}/priceActions/${id}`, priceActionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating price action with id ${id}:`, error);
    throw error;
  }
};

const deletePriceAction = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/priceActions/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting price action with id ${id}:`, error);
    throw error;
  }
};

export {
  getAllPriceActions,
  getPriceAction,
  createPriceAction,
  updatePriceAction,
  deletePriceAction,
};
