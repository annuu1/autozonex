import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
export const getAllSymbols = async () => {
  try {
    const response = await axios.get(`${API_URL}/symbols`);
    return response.data;
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
};
export const getSymbolById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/symbols/${id}`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching symbol:', error);
    throw error;
  }
}

//search symbols
export const searchSymbols = async (term) => {
  try {
    const response = await axios.get(`${API_URL}/symbols/search/${term}`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
}