import React, { useState } from "react";
import {
  createSettings,
  updateSettings,
  deleteSettings,
} from "../../api/setting";

const SettingsForm = ({ open, onClose, existingSettings }) => {
  const [riskPerTrade, setRiskPerTrade] = useState(
    existingSettings?.riskPerTrade || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const settingsId = existingSettings?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (settingsId) {
        await updateSettings({ riskPerTrade });
        setSuccess("Settings updated successfully.");
      } else {
        await createSettings({ riskPerTrade });
        setSuccess("Settings created successfully.");
      }
      onClose && onClose();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to save settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your settings?")) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await deleteSettings();
      setRiskPerTrade("");
      setSuccess("Settings deleted successfully.");
      onClose && onClose();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to delete settings."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {settingsId ? "Edit Settings" : "Add Settings"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="riskPerTrade"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Risk Per Trade (%)
            </label>
            <input
              id="riskPerTrade"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={riskPerTrade}
              onChange={(e) => setRiskPerTrade(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm">{success}</div>
          )}

          <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>

            {settingsId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading}
              >
                Delete
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading
                ? settingsId
                  ? "Updating..."
                  : "Saving..."
                : settingsId
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
