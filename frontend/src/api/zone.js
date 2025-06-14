import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "";

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
// Get demand zones for a specific ticker and time frame
export const getDemandZones = async (ticker, timeFrame) => {
  const response = await axios.get(
    `${API_URL}/zones/${ticker}/${timeFrame}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get all demand zones
export const getAllDemandZones = async () => {
  const response = await axios.get(
    `${API_URL}/zones/allZones`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get daily demand zones (requires auth)
export const getDailyDemandZones = async (targetDate) => {
  const response = await axios.get(
    `${API_URL}/zones/daily?targetDate=${targetDate}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

//detect zones (requires auth)
export const detectZones = async (timeFrame, targetDate) => {
  const response = await axios.post(
    `${API_URL}/zones/detect`,
    { timeFrame, targetDate },
    { headers: getAuthHeaders() }
  );
  return response.data;
};
