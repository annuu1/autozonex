import axios from "axios";
const GSHEETS_API =  import.meta.env.VITE_GSHEETS_API || "https://script.google.com/macros/s/AKfycbyJYgFC4RcSbn86wirSof-FcJ4pc69BF4QtgT8-FSThA6AMToQiBG1kuFYxkLJCB5Ef/exec";

// CRUD functions for alert management via GSHEETS_API

// Create a new alert
export async function createAlert({ ticker, alertPrice, condition, userEmail, telegramChatId }) {
  const params = new URLSearchParams({
    method: "create",
    ticker,
    alertPrice,
    condition,
    userEmail,
    telegramChatId,
  });
  const url = `${GSHEETS_API}?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

// Get all alerts
export async function getAlerts(email) {
  const params = new URLSearchParams({userEmail:email});
  const response = await axios.get(`${GSHEETS_API}?${params.toString()}`);
  return response.data;
}

// Get a single alert by id
export async function getAlertById(id) {
  const params = new URLSearchParams({ id });
  const url = `${GSHEETS_API}?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

// Update an alert
export async function updateAlert({ id, alertPrice, userEmail, ticker, condition, telegramChatId }) {
  // Only send fields that are provided
  const params = new URLSearchParams({ method: "update", id });
  if (alertPrice !== undefined) params.append("alertPrice", alertPrice);
  if (userEmail !== undefined) params.append("userEmail", userEmail);
  if (ticker !== undefined) params.append("ticker", ticker);
  if (condition !== undefined) params.append("condition", condition);
  if (telegramChatId !== undefined) params.append("telegramChatId", telegramChatId);

  const url = `${GSHEETS_API}?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

// Delete an alert
export async function deleteAlert(id) {
  const params = new URLSearchParams({ method: "delete", id });
  const url = `${GSHEETS_API}?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}
