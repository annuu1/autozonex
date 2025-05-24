import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/watchList` || "";

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

export async function getWatchLists() {
  try {
    const res = await axios.get(API_BASE, {
      headers: getAuthHeaders(),
      
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch watchlists');
  }
}

export async function getWatchListById(id) {
  try {
    const res = await axios.get(`${API_BASE}/${id}`, {
      headers: getAuthHeaders(),
      
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch watchlist');
  }
}

export async function createWatchList({ name, symbols }) {
  try {
    const res = await axios.post(API_BASE, { name, symbols }, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to create watchlist');
  }
}

export async function updateWatchList(id, { name, symbols }) {
  try {
    const res = await axios.put(`${API_BASE}/${id}`, { name, symbols }, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to update watchlist');
  }
}

export async function deleteWatchList(id) {
  try {
    const res = await axios.delete(`${API_BASE}/${id}`, {
      headers: getAuthHeaders(),
      
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to delete watchlist');
  }
}

export async function addSymbolToWatchList(id, symbol) {
  try {
    const res = await axios.post(`${API_BASE}/${id}/symbols`, { symbol }, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to add symbol to watchlist');
  }
}

export async function removeSymbolFromWatchList(id, symbol) {
  try {
    const res = await axios.delete(`${API_BASE}/${id}/symbols`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      
      data: { symbol },
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to remove symbol from watchlist');
  }
}