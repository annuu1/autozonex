const API_BASE = '/api/watchList';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

export async function getWatchLists() {
  const res = await fetch(API_BASE, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch watchlists');
  return res.json();
}

export async function getWatchListById(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  return res.json();
}

export async function createWatchList({ name, symbols }) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify({ name, symbols }),
  });
  if (!res.ok) throw new Error('Failed to create watchlist');
  return res.json();
}

export async function updateWatchList(id, { name, symbols }) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify({ name, symbols }),
  });
  if (!res.ok) throw new Error('Failed to update watchlist');
  return res.json();
}

export async function deleteWatchList(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error('Failed to delete watchlist');
  return res.json();
}

export async function addSymbolToWatchList(id, symbol) {
  const res = await fetch(`${API_BASE}/${id}/symbols`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify({ symbol }),
  });
  if (!res.ok) throw new Error('Failed to add symbol to watchlist');
  return res.json();
}

export async function removeSymbolFromWatchList(id, symbol) {
  const res = await fetch(`${API_BASE}/${id}/symbols`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify({ symbol }),
  });
  if (!res.ok) throw new Error('Failed to remove symbol from watchlist');
  return res.json();
}

