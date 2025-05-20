const API_URL = import.meta.env.VITE_API_URL || "";

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

// Get all trade journal entries for the current user
export async function fetchTradeJournals() {
  const res = await fetch(`${API_URL}/trade-journal`, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch trade journals');
  return res.json();
}

// Get a specific trade journal entry by ID
export async function fetchTradeJournal(id) {
  const res = await fetch(`${API_URL}/trade-journal/${id}`, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch trade journal entry');
  return res.json();
}

// Create a new trade journal entry
export async function createTradeJournal(data) {
  const res = await fetch(`${API_URL}/trade-journal`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create trade journal entry');
  return res.json();
}

// Update an existing trade journal entry by ID
export async function updateTradeJournal(id, data) {
  const res = await fetch(`${API_URL}/trade-journal/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update trade journal entry');
  return res.json();
}

// Delete a trade journal entry by ID
export async function deleteTradeJournal(id) {
  const res = await fetch(`${API_URL}/trade-journal/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete trade journal entry');
  return res.json();
}

// Get trade statistics for the current user
export async function fetchTradeStatistics() {
  const res = await fetch(`${API_URL}/trade-journal/statistics`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch trade statistics');
  return res.json();
}
