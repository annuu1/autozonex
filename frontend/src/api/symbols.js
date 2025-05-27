import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () =>{
  return {
    headers:{
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
}
}

export const getAllSymbols = async () => {
  try {
    const response = await axios.get(`${API_URL}/symbols`,getHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
};
export const getSymbolById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/symbols/${id}`,getHeaders());
    return response.data;
  }
  catch (error) {
    console.error('Error fetching symbol:', error);
    throw error;
  }
}
export const createSymbol= async (symbol)=>{
  try {
    const response = await axios.post(`${API_URL}/symbols`,symbol,getHeaders());
    return response.data;
  }
  catch (error) {
    console.error('Error creating symbol:', error);
    throw error;
  }
}

//search symbols
export const searchSymbols = async (term) => {
  try {
    const response = await axios.get(`${API_URL}/symbols/search/${term}`,getHeaders());
    return response.data;
  }
  catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
}