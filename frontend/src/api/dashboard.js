import axios from 'axios';
import getAuthHeaders from '../utils/getAuthHeaders.js';

const API_BASE = `${import.meta.env.VITE_API_URL}/dashboard`;

export const fetchDashboardStats = () => axios.get(`${API_BASE}/stats`, { headers: getAuthHeaders() }).then(res => res.data);
export const fetchDashboardPnL = () => axios.get(`${API_BASE}/pnl`, { headers: getAuthHeaders() }).then(res => res.data);
export const fetchDashboardTradeScore = () => axios.get(`${API_BASE}/trade-score`, { headers: getAuthHeaders() }).then(res => res.data);
export const fetchDashboardZones = () => axios.get(`${API_BASE}/zones`, { headers: getAuthHeaders() }).then(res => res.data);
