import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "";

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
// Get all notes for the authenticated user
export const getNotes = async () => {
  const response = await axios.get(`${API_URL}/notes`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get a single note by ID
export const getNoteById = async (id) => {
  const response = await axios.get(`${API_URL}/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Create a new note
export const createNote = async (noteData) => {
  const response = await axios.post(`${API_URL}/notes`, noteData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Update a note
export const updateNote = async (id, noteData) => {
  const response = await axios.put(`${API_URL}/notes/${id}`, noteData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Delete a note
export const deleteNote = async (id) => {
  const response = await axios.delete(`${API_URL}/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
