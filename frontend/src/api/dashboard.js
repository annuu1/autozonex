import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/dashboard`;

export const fetchDashboardStats = () => axios.get(`${API_BASE}/stats`).then(res => res.data);
export const fetchDashboardPnL = () => axios.get(`${API_BASE}/pnl`).then(res => res.data);
export const fetchDashboardTradeScore = () => axios.get(`${API_BASE}/trade-score`).then(res => res.data);
export const fetchDashboardZones = () => axios.get(`${API_BASE}/zones`).then(res => res.data);
