import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/settings';

// Get settings for the authenticated user
export const getSettings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create new settings
export const createSettings = async (settingsData) => {
  const response = await axios.post(API_URL, settingsData);
  return response.data;
};

// Update settings for the authenticated user
export const updateSettings = async (settingsData) => {
  const response = await axios.put(API_URL, settingsData);
  return response.data;
};

// Delete settings for the authenticated user
export const deleteSettings = async () => {
  const response = await axios.delete(API_URL);
  return response.data;
};
