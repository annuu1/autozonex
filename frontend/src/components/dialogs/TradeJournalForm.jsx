import React, { useState, useEffect } from "react";
import {
  createTradeJournal,
  updateTradeJournal,
  fetchTradeJournal,
} from "../../api/tradeJournal";

const initialFormState = {
  tradeDate: "",
  symbol: "",
  tradeType: "",
  entryPrice: "",
  quantity: "",
  positionSize: "",
  fees: "",
  stopLoss: "100",
  strategy: "",
  tags: [],
  journalNotes: "",
  setupScreenshotUrl: "",
  emotionBefore: "",
};

const TradeJournalForm = ({ open, onClose, onSuccess, editId = null }) => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Calculate positionSize whenever entryPrice or quantity changes
  useEffect(() => {
    if (form.entryPrice && form.quantity) {
      const calculatedPositionSize = (
        parseFloat(form.entryPrice) * parseInt(form.quantity)
      ).toFixed(2);
      setForm((prev) => ({
        ...prev,
        positionSize: calculatedPositionSize,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        positionSize: "",
      }));
    }
  }, [form.entryPrice, form.quantity]);

  // Fetch entry if editing
  useEffect(() => {
    if (editId && open) {
      setLoading(true);
      fetchTradeJournal(editId)
        .then((data) => {
          setForm({
            tradeDate: data.tradeDate ? data.tradeDate.slice(0, 10) : "",
            symbol: data.symbol || "",
            tradeType: data.tradeType || "",
            entryPrice: data.entryPrice || "",
            quantity: data.quantity || "",
            positionSize: data.positionSize || "",
            fees: data.fees || "",
            stopLoss: data.stopLoss || "100",
            strategy: data.strategy || "",
            tags: data.tags || [],
            journalNotes: data.journalNotes || "",
            setupScreenshotUrl: data.setupScreenshotUrl || "",
            emotionBefore: data.emotionBefore || "",
          });
          setTagsInput(data.tags ? data.tags.join(", ") : "");
        })
        .catch((err) => {
          setError("Failed to load entry.");
        })
        .finally(() => setLoading(false));
    } else if (open) {
      setForm(initialFormState);
      setTagsInput("");
      setError("");
    }
  }, [editId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    setForm((prev) => ({
      ...prev,
      tags: value ? value.split(",").map((tag) => tag.trim()).filter((tag) => tag) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        entryPrice: form.entryPrice ? parseFloat(form.entryPrice) : undefined,
        quantity: form.quantity ? parseInt(form.quantity) : undefined,
        positionSize: form.positionSize ? parseFloat(form.positionSize) : undefined,
        fees: form.fees ? parseFloat(form.fees) : undefined,
        stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : undefined,
      };
      console.log(payload)
      if (editId) {
        await updateTradeJournal(editId, payload);
      } else {
        await createTradeJournal(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.message ||
          "Failed to save entry. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl p-6">
          <h2 className="text-2xl font-bold">
            {editId ? "Edit Trade Journal Entry" : "New Trade Journal Entry"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tradeDate"
              value={form.tradeDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring- olvas2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade Type <span className="text-red-500">*</span>
            </label>
            <select
              name="tradeType"
              value={form.tradeType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              <option value="">Select</option>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
              <option value="Short">Short</option>
              <option value="Cover">Cover</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="entryPrice"
              value={form.entryPrice}
              onChange={handleChange}
              required
              min="0"
              step="any"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position Size <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="positionSize"
              value={form.positionSize}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss
            </label>
            <input
              type="number"
              name="stopLoss"
              value={form.stopLoss}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fees
            </label>
            <input
              type="number"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              min="0"
              step="any"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strategy ID
            </label>
            <input
              type="text"
              name="strategy"
              value={form.strategy}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="e.g., swing, breakout"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            {form.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Setup Screenshot URL
            </label>
            <input
              type="url"
              name="setupScreenshotUrl"
              value={form.setupScreenshotUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emotion Before
            </label>
            <input
              type="text"
              name="emotionBefore"
              value={form.emotionBefore}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Journal Notes
            </label>
            <textarea
              name="journalNotes"
              value={form.journalNotes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          {error && (
            <div className="md:col-span-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200"
            >
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeJournalForm;