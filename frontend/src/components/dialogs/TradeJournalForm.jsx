import React, { useState, useEffect, useCallback } from 'react';
import {
  createTradeJournal,
  updateTradeJournal,
  fetchTradeJournal,
} from '../../api/tradeJournal';
import { getSettings } from '../../api/setting';
import SymbolSuggestionInput from '../../components/common/SymbolSuggestionInput';
import { searchSymbols } from '../../api/symbols';
import debounce from 'lodash.debounce';

const initialFormState = {
  tradeDate: new Date().toISOString().slice(0, 10),
  symbol: '',
  tradeType: 'Buy',
  entryPrice: '',
  exitPrice: '',
  exitDate: '',
  quantity: '',
  positionSize: '',
  stopLoss: '0',
  takeProfit: '',
  pnl: '',
  fees: '',
  strategy: 'WIT',
  tags: [],
  status: 'Open',
  setupScreenshotUrl: '',
  journalNotes: '',
  emotionBefore: '',
  emotionAfter: '',
  broker: '',
  market: '',
  holdingPeriod: '',
  riskRewardRatio: '',
  rateTrade: '',
  mode: 'Live',
  result: '',
};

const TradeJournalForm = ({ editId = null, onSuccess }) => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [stopLossTouched, setStopLossTouched] = useState(false);
  const [useRiskPerTrade, setUseRiskPerTrade] = useState(false);
  const [riskPerTrade, setRiskPerTrade] = useState(100);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch risk per trade
  useEffect(() => {
    const fetchRiskPerTrade = async () => {
      try {
        const token = localStorage.getItem('token');
        const risk = await getSettings(token);
        setRiskPerTrade(risk.riskPerTrade);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRiskPerTrade();
  }, []);

  // Fetch entry if editing
  useEffect(() => {
    if (editId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const data = await fetchTradeJournal(editId);
          const sanitizedData = {
            ...initialFormState,
            ...data,
            tradeDate: data.tradeDate
              ? data.tradeDate.split('T')[0]
              : initialFormState.tradeDate,
            exitDate: data.exitDate ? data.exitDate.split('T')[0] : '',
            entryPrice:
              data.entryPrice != null ? data.entryPrice.toString() : '',
            exitPrice: data.exitPrice != null ? data.exitPrice.toString() : '',
            quantity: data.quantity != null ? data.quantity.toString() : '',
            positionSize:
              data.positionSize != null ? data.positionSize.toString() : '',
            stopLoss: data.stopLoss != null ? data.stopLoss.toString() : '',
            takeProfit:
              data.takeProfit != null ? data.takeProfit.toString() : '',
            pnl: data.pnl != null ? data.pnl.toString() : '',
            fees: data.fees != null ? data.fees.toString() : '',
            strategy: data.strategy || 'WIT',
            tags: Array.isArray(data.tags) ? data.tags : [],
            status: data.status || 'Open',
            setupScreenshotUrl: data.setupScreenshotUrl || '',
            journalNotes: data.journalNotes || '',
            emotionBefore: data.emotionBefore || '',
            emotionAfter: data.emotionAfter || '',
            broker: data.broker || '',
            market: data.market || '',
            holdingPeriod: data.holdingPeriod || '',
            riskRewardRatio: data.riskRewardRatio || '',
            rateTrade: data.rateTrade != null ? data.rateTrade.toString() : '',
            mode: data.mode || 'Live',
            result: data.result || '',
          };
          setForm(sanitizedData);
          setTagsInput(sanitizedData.tags.join(', '));
        } catch (err) {
          setError('Failed to load entry.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setForm(initialFormState);
      setTagsInput('');
      setError('');
      setStopLossTouched(false);
      setUseRiskPerTrade(false);
      setValidationErrors({});
    }
  }, [editId]);

  // Calculate quantity and positionSize
  useEffect(() => {
    if (form.entryPrice && form.stopLoss) {
      const entryPriceFloat = parseFloat(form.entryPrice);
      const stopLossFloat = parseFloat(form.stopLoss);

      if (useRiskPerTrade && entryPriceFloat > stopLossFloat) {
        const quantity = Math.floor(
          riskPerTrade / (entryPriceFloat - stopLossFloat)
        );
        const calculatedPositionSize = (quantity * entryPriceFloat).toFixed(2);
        setForm((prev) => ({
          ...prev,
          quantity: quantity.toString(),
          positionSize: calculatedPositionSize,
        }));
      } else if (form.quantity) {
        const calculatedPositionSize = (
          entryPriceFloat * parseInt(form.quantity)
        ).toFixed(2);
        setForm((prev) => ({
          ...prev,
          positionSize: calculatedPositionSize,
          stopLoss: !stopLossTouched
            ? (entryPriceFloat * 0.99).toFixed(2)
            : prev.stopLoss,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          positionSize: '',
          quantity: useRiskPerTrade ? prev.quantity : '',
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        positionSize: '',
        quantity: useRiskPerTrade ? prev.quantity : '',
      }));
    }
  }, [
    form.entryPrice,
    form.stopLoss,
    form.quantity,
    useRiskPerTrade,
    riskPerTrade,
    stopLossTouched,
  ]);

  // Auto-set status to Closed if exitPrice is entered
  useEffect(() => {
    if (form.exitPrice && form.status !== 'Closed') {
      setForm((prev) => ({ ...prev, status: 'Closed' }));
    }
  }, [form.exitPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value === null || value === undefined ? '' : value;
    setForm((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
    // Clear validation error for this field
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value || '';
    setTagsInput(value);
    setForm((prev) => ({
      ...prev,
      tags: value
        ? value
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
    }));
  };

  const handleSymbolChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, symbol: value });
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        setSymbolOptions([]);
        return;
      }
      try {
        const results = await searchSymbols(query);
        setSymbolOptions(results);
      } catch (error) {
        console.error('Error fetching symbols:', error);
      }
    }, 500),
    []
  );

  const validateForm = () => {
    const errors = {};
    if (!form.tradeDate) errors.tradeDate = 'Trade Date is required';
    if (!form.symbol) errors.symbol = 'Symbol is required';
    if (!form.tradeType) errors.tradeType = 'Trade Type is required';
    if (!form.entryPrice || parseFloat(form.entryPrice) <= 0)
      errors.entryPrice = 'Valid Entry Price is required';
    if (!editId && (!form.stopLoss || parseFloat(form.stopLoss) <= 0))
      errors.stopLoss = 'Valid Stop Loss is required';
    if (!form.quantity || parseInt(form.quantity) <= 0)
      errors.quantity = 'Valid Quantity is required';
    if (!form.strategy && !editId) errors.strategy = 'Strategy is required';
    if (!form.status) errors.status = 'Status is required';
    if (form.status === 'Closed') {
      if (!form.exitPrice || parseFloat(form.exitPrice) <= 0)
        errors.exitPrice = 'Exit Price is required for Closed status';
      if (!form.exitDate) errors.exitDate = 'Exit Date is required for Closed status';
    }
    if (form.rateTrade && (parseInt(form.rateTrade) < 0 || parseInt(form.rateTrade) > 10))
      errors.rateTrade = 'Rate Trade must be between 0 and 10';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please correct the errors in the form.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        entryPrice: form.entryPrice ? parseFloat(form.entryPrice) : undefined,
        exitPrice: form.exitPrice ? parseFloat(form.exitPrice) : undefined,
        quantity: form.quantity ? parseInt(form.quantity) : undefined,
        positionSize: form.positionSize
          ? parseFloat(form.positionSize)
          : undefined,
        stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : undefined,
        takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : undefined,
        pnl: form.pnl ? parseFloat(form.pnl) : undefined,
        fees: form.fees ? parseFloat(form.fees) : undefined,
        tradeDate: form.tradeDate || undefined,
        exitDate: form.exitDate || undefined,
        rateTrade: form.rateTrade !== '' ? Number(form.rateTrade) : undefined,
        mode: form.mode || undefined,
        result: form.result || undefined,
      };
      if (editId) {
        await updateTradeJournal(editId, payload);
      } else {
        await createTradeJournal(payload);
      }
      onSuccess(payload);
    } catch (err) {
      setError(
        err?.message ||
          'Failed to save entry. Please check your input and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editId ? 'Edit Trade Journal Entry' : 'New Trade Journal Entry'}
      </h2>
      {!editId && (
        <div className="flex items-center mb-4">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Use Preset Risk Per Trade (₹{riskPerTrade})
          </label>
          <input
            type="checkbox"
            checked={useRiskPerTrade}
            onChange={(e) => setUseRiskPerTrade(e.target.checked)}
            className="h-5 w-5 text-indigo-600 rounded"
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primary Fields Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Primary Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trade Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tradeDate"
                value={form.tradeDate || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.tradeDate ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.tradeDate && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.tradeDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbol <span className="text-red-500">*</span>
              </label>
              <SymbolSuggestionInput
                value={form.symbol}
                onChange={handleSymbolChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.symbol ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.symbol && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.symbol}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trade Type <span className="text-red-500">*</span>
              </label>
              <select
                name="tradeType"
                value={form.tradeType || 'Buy'}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.tradeType ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
                <option value="Short">Short</option>
                <option value="Cover">Cover</option>
              </select>
              {validationErrors.tradeType && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.tradeType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="entryPrice"
                value={form.entryPrice || ''}
                onChange={handleChange}
                min="0"
                step="any"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.entryPrice ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.entryPrice && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.entryPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stop Loss {editId ? '' : <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                name="stopLoss"
                value={form.stopLoss || ''}
                onChange={(e) => {
                  handleChange(e);
                  setStopLossTouched(true);
                }}
                min="0"
                step="any"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.stopLoss ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.stopLoss && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.stopLoss}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity || ''}
                onChange={handleChange}
                min="0"
                step="1"
                readOnly={useRiskPerTrade && !editId}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  useRiskPerTrade && !editId ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${validationErrors.quantity ? 'border-red-500' : 'border-gray-200'}`}
              />
              {validationErrors.quantity && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="positionSize"
                value={form.positionSize || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strategy {editId ? '' : <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="strategy"
                value={form.strategy || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.strategy ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.strategy && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.strategy}</p>
              )}
            </div>
          </div>
        </div>

        {/* Trade Status Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Trade Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status || 'Open'}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.status ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="Planned">Planned</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Paper">Paper</option>
              </select>
              {validationErrors.status && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.status}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit Price {form.status === 'Closed' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                name="exitPrice"
                value={form.exitPrice || ''}
                onChange={handleChange}
                min="0"
                step="any"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.exitPrice ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.exitPrice && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.exitPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit Date {form.status === 'Closed' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                name="exitDate"
                value={form.exitDate || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.exitDate ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {validationErrors.exitDate && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.exitDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result
              </label>
              <select
                name="result"
                value={form.result || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Result</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Take Profit
              </label>
              <input
                type="number"
                name="takeProfit"
                value={form.takeProfit || ''}
                onChange={handleChange}
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PnL
              </label>
              <input
                type="number"
                name="pnl"
                value={form.pnl || ''}
                onChange={handleChange}
                step="any"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fees
              </label>
              <input
                type="number"
                name="fees"
                value={form.fees || ''}
                onChange={handleChange}
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate Trade
              </label>
              <input
                type="number"
                name="rateTrade"
                value={form.rateTrade || ''}
                onChange={handleChange}
                min="0"
                max="10"
                step="1"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.rateTrade ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Rate 1-10"
              />
              {validationErrors.rateTrade && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.rateTrade}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode
              </label>
              <select
                name="mode"
                value={form.mode || 'Live'}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Paper">Paper</option>
                <option value="Live">Live</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput || ''}
                onChange={handleTagsChange}
                placeholder="e.g., swing, breakout"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                value={form.setupScreenshotUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emotion Before
              </label>
              <input
                type="text"
                name="emotionBefore"
                value={form.emotionBefore || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emotion After
              </label>
              <input
                type="text"
                name="emotionAfter"
                value={form.emotionAfter || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Broker
              </label>
              <input
                type="text"
                name="broker"
                value={form.broker || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market
              </label>
              <input
                type="text"
                name="market"
                value={form.market || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holding Period
              </label>
              <input
                type="text"
                name="holdingPeriod"
                value={form.holdingPeriod || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk/Reward Ratio
              </label>
              <input
                type="text"
                name="riskRewardRatio"
                value={form.riskRewardRatio || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Journal Notes</h3>
          <textarea
            name="journalNotes"
            value={form.journalNotes || ''}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your trade notes..."
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setForm(initialFormState)}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeJournalForm;