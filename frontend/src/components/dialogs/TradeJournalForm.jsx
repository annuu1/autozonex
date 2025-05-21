import React, { useState, useEffect } from "react";
import {
  createTradeJournal,
  updateTradeJournal,
  fetchTradeJournal,
} from "../../api/tradeJournal";

const initialFormState = {
  tradeDate: new Date().toISOString().slice(0, 10),
  symbol: "",
  tradeType: "Buy",
  entryPrice: "",
  exitPrice: "",
  exitDate: "",
  quantity: "",
  positionSize: "",
  stopLoss: "100",
  takeProfit: "",
  pnl: "",
  fees: "",
  strategy: "WIT",
  tags: [],
  status: "Open",
  setupScreenshotUrl: "",
  journalNotes: "",
  emotionBefore: "",
  emotionAfter: "",
  broker: "",
  market: "",
  holdingPeriod: "",
  riskRewardRatio: "",
};

const TradeJournalForm = ({ open, onClose, onSuccess, editId = null }) => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [stopLossTouched, setStopLossTouched] = useState(false);
  const [useRiskPerTrade, setUseRiskPerTrade] = useState(false);
  const [riskPerTrade, setRiskPerTrade] = useState(100); // Hardcoded to 100 rupees

  // Calculate quantity and positionSize based on riskPerTrade toggle
  useEffect(() => {
    if (form.entryPrice && form.stopLoss) {
      const entryPriceFloat = parseFloat(form.entryPrice);
      const stopLossFloat = parseFloat(form.stopLoss);

      if (useRiskPerTrade && entryPriceFloat > stopLossFloat) {
        // Calculate quantity: riskPerTrade / (entryPrice - stopLoss)
        const quantity = Math.floor(riskPerTrade / (entryPriceFloat - stopLossFloat));
        const calculatedPositionSize = (quantity * entryPriceFloat).toFixed(2);
        setForm((prev) => ({
          ...prev,
          quantity: quantity.toString(),
          positionSize: calculatedPositionSize,
        }));
      } else if (form.quantity) {
        // Default behavior: positionSize = entryPrice * quantity
        const calculatedPositionSize = (entryPriceFloat * parseInt(form.quantity)).toFixed(2);
        setForm((prev) => ({
          ...prev,
          positionSize: calculatedPositionSize,
          stopLoss: !stopLossTouched ? (entryPriceFloat * 0.99).toFixed(2) : prev.stopLoss,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          positionSize: "",
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        positionSize: "",
        quantity: useRiskPerTrade ? prev.quantity : "", // Preserve quantity if using riskPerTrade
      }));
    }
  }, [form.entryPrice, form.stopLoss, form.quantity, useRiskPerTrade, riskPerTrade, stopLossTouched]);

  // Fetch entry if editing
  useEffect(() => {
    if (editId && open) {
      setLoading(true);
      const fetchData = async ()=>{
        try {
          const data = await fetchTradeJournal(editId);
          setForm(data);
        } catch (err) {
          setError("Failed to load entry.");
        } finally {
          setLoading(false);
      }}
      fetchData();
    } else if (open) {
      setForm(initialFormState);
      setTagsInput("");
      setError("");
      setStopLossTouched(false);
      setUseRiskPerTrade(false);
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
        exitPrice: form.exitPrice ? parseFloat(form.exitPrice) : undefined,
        quantity: form.quantity ? parseInt(form.quantity) : undefined,
        positionSize: form.positionSize ? parseFloat(form.positionSize) : undefined,
        stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : undefined,
        takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : undefined,
        pnl: form.pnl ? parseFloat(form.pnl) : undefined,
        fees: form.fees ? parseFloat(form.fees) : undefined,
        tradeDate: form.tradeDate ? form.tradeDate : undefined,
        exitDate: form.exitDate ? form.exitDate : undefined,
      };
      if (editId) {
        await updateTradeJournal(editId, payload);
      } else {
        await onSuccess(payload); // Send payload to parent
      }
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
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl p-6 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editId ? "Edit Trade Journal Entry" : "New Trade Journal Entry"}
          </h2>
          {!editId && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-white">
                Use Preset Risk Per Trade (₹100)
              </label>
              <input
                type="checkbox"
                checked={useRiskPerTrade}
                onChange={(e) => setUseRiskPerTrade(e.target.checked)}
                className="h-5 w-5 text-indigo-600 rounded"
              />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Required Fields (Always Displayed) */}
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
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
              Stop Loss {editId ? "" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name="stopLoss"
              value={form.stopLoss}
              onChange={(e) => {
                handleChange(e);
                setStopLossTouched(true);
              }}
              required={!editId}
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
              readOnly={useRiskPerTrade && !editId}
              className={`w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${
                useRiskPerTrade && !editId ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
              Strategy {editId ? "" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="strategy"
              value={form.strategy}
              onChange={handleChange}
              required={!editId}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              <option value="Planned">Planned</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Paper">Paper</option>
            </select>
          </div>

          {/* Optional Fields (Displayed Only When Editing) */}
          {editId && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exit Price
                </label>
                <input
                  type="number"
                  name="exitPrice"
                  value={form.exitPrice}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exit Date
                </label>
                <input
                  type="date"
                  name="exitDate"
                  value={form.exitDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Take Profit
                </label>
                <input
                  type="number"
                  name="takeProfit"
                  value={form.takeProfit}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PnL
                </label>
                <input
                  type="number"
                  name="pnl"
                  value={form.pnl}
                  onChange={handleChange}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emotion After
                </label>
                <input
                  type="text"
                  name="emotionAfter"
                  value={form.emotionAfter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Broker
                </label>
                <input
                  type="text"
                  name="broker"
                  value={form.broker}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Market
                </label>
                <input
                  type="text"
                  name="market"
                  value={form.market}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holding Period
                </label>
                <input
                  type="text"
                  name="holdingPeriod"
                  value={form.holdingPeriod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk/Reward Ratio
              </label>
              <input
                type="text"
                name="riskRewardRatio"
                value={form.riskRewardRatio}
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
          </>
        )}
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