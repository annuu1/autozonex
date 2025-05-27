import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { searchSymbols } from '../../api/symbols';
import debounce from 'lodash.debounce';

const AddPriceActionForm = ({ onSubmit, onCancel, priceAction }) => {
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    symbol: '', // symbol id
    follows_demand_supply: false,
    trend_direction_HTF: '',
    current_EMA_alignment: '',
    notes: '',
    userId: user._id,
    confidence_score: '',
    volume_behavior: '',
    candle_behavior_notes: '',
    last_seen: '',
    source_timeframes: [
      {
        _id: '',
        timeframe: '',
        zone_type: '',
        zone_price_range: '',
        reason_price_reached_here: ''
      }
    ],
    key_levels: [],
    trade_setups: [],
    positives: [],
    negatives: []
  });

  // Timeframe fields state
  const [timeframeFields, setTimeframeFields] = useState([{
    timeframe: '',
    zone_type: '',
    zone_price_range: '',
    reason_price_reached_here: ''
  }]);

  // Symbol search state
  const [symbolOptions, setSymbolOptions] = useState([]);
  const [symbolInput, setSymbolInput] = useState('');

  // Handle adding new timeframe entries
  const handleAddTimeframe = () => {
    setTimeframeFields([...timeframeFields, {
      timeframe: '',
      zone_type: '',
      zone_price_range: '',
      reason_price_reached_here: ''
    }]);
  };

  // Handle removing timeframe entries
  const handleRemoveTimeframe = (index) => {
    setTimeframeFields(timeframeFields.filter((_, i) => i !== index));
  };

  // Handle timeframe field changes
  const handleTimeframeChange = (index, field, value) => {
    setTimeframeFields(timeframeFields.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // Update form data when timeframe fields change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      source_timeframes: timeframeFields.map((field, index) => ({
        _id: prev.source_timeframes[index]?._id || '',
        ...field
      }))
    }));
  }, [timeframeFields]);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle array field changes
  const handleArrayFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const selected = symbolOptions.find((sym) => sym.symbol === symbolInput);

    if (!selected && !priceAction) {
      alert('Please select a valid symbol from suggestions.');
      return;
    }

    // Clean up _id fields in array objects before submitting
    const cleanArray = (arr) =>
      (arr || []).map(({ _id, ...rest }) => (_id && _id !== '' ? { _id, ...rest } : rest));

    const dataToSubmit = {
      ...formData,
      symbol: selected ? selected._id : formData.symbol, // for edit keep existing symbol id
      source_timeframes: cleanArray(formData.source_timeframes),
      key_levels: cleanArray(formData.key_levels),
      participants: cleanArray(formData.participants),
    };

    onSubmit(dataToSubmit);
  };


  // Debounced search for symbols
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
    }, 300),
    []
  );

  // Initialize form data with priceAction if provided
  useEffect(() => {
    if (priceAction) {
      // Initialize timeframe fields with existing data
      setTimeframeFields(priceAction.source_timeframes.map(tf => ({
        timeframe: tf.timeframe,
        zone_type: tf.zone_type,
        zone_price_range: tf.zone_price_range,
        reason_price_reached_here: tf.reason_price_reached_here
      })));
      
      setFormData(prev => ({
        ...prev,
        ...priceAction,
        userId: user._id,
      }));
      setSymbolInput(priceAction.symbol?.symbol || ''); // assuming populated symbol
    }
  }, [priceAction, user]);

  // Handle symbol input change
  const handleSymbolChange = (e) => {
    const value = e.target.value;
    setSymbolInput(value);
    debouncedSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap gap-4">
      {/* Symbol */}
      <div>
        <input
          list="symbol-suggestions"
          value={symbolInput}
          onChange={handleSymbolChange}
          placeholder="Symbol"
          className="border p-2 rounded"
          required={!priceAction}
        />

        <datalist id="symbol-suggestions">
          {symbolOptions.map((sym) => (
            <option key={sym._id} value={sym.symbol} />
          ))}
        </datalist>
      </div>

      {/* Simple inputs */}
      <input
        name="trend_direction_HTF"
        value={formData.trend_direction_HTF}
        onChange={handleFormChange}
        placeholder="Trend Direction HTF"
        className="border p-2 rounded"
      />

      <input
        name="current_EMA_alignment"
        value={formData.current_EMA_alignment}
        onChange={handleFormChange}
        placeholder="EMA Alignment"
        className="border p-2 rounded"
      />

      <input
        name="confidence_score"
        value={formData.confidence_score}
        onChange={handleFormChange}
        placeholder="PA Score (1-10)"
        type="number"
        min="1"
        max="10"
        className="min-w-36 border p-2 rounded mb-4"
      />

      {/* Source Timeframes Section */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Source Timeframes</h3>
        {timeframeFields.map((field, index) => (
          <div key={index} className="border-b last:border-0 pb-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Timeframe {index + 1}</span>
              <button
                onClick={() => handleRemoveTimeframe(index)}
                className="text-red-500 hover:text-red-700"
                disabled={timeframeFields.length === 1}
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Timeframe</label>
                <select
                  name="timeframe"
                  value={field.timeframe}
                  onChange={(e) => handleTimeframeChange(index, 'timeframe', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select timeframe</option>
                  <option value="1M">1M</option>
                  <option value="1W">1W</option>
                  <option value="1D">1D</option>
                  <option value="4H">4H</option>
                  <option value="1H">1H</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Zone Type</label>
                <select
                  name="zone_type"
                  value={field.zone_type}
                  onChange={(e) => handleTimeframeChange(index, 'zone_type', e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select zone type</option>
                  <option value="Demand">Demand</option>
                  <option value="Supply">Supply</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Zone Price Range</label>
                <input
                  name="zone_price_range"
                  value={field.zone_price_range}
                  onChange={(e) => handleTimeframeChange(index, 'zone_price_range', e.target.value)}
                  placeholder="e.g., 2450-2520"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Reason Price Reached Here</label>
                <textarea
                  name="reason_price_reached_here"
                  value={field.reason_price_reached_here}
                  onChange={(e) => handleTimeframeChange(index, 'reason_price_reached_here', e.target.value)}
                  rows="2"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddTimeframe}
          className="text-blue-500 hover:text-blue-700"
        >
          + Add Another Timeframe
        </button>
      </div>

      {/* Key Levels Section */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Key Levels</h3>
        {formData.key_levels.map((level, idx) => (
          <div key={idx} className="flex gap-2 items-end mb-2">
            <div>
              <label className="block text-xs">Level Type</label>
              <select
                value={level.level_type}
                onChange={e => {
                  const updated = [...formData.key_levels];
                  updated[idx].level_type = e.target.value;
                  handleArrayFieldChange('key_levels', updated);
                }}
                className="border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="Resistance">Resistance</option>
                <option value="Support">Support</option>
                <option value="125EMA">125EMA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs">Price</label>
              <input
                type="number"
                value={level.price}
                onChange={e => {
                  const updated = [...formData.key_levels];
                  updated[idx].price = e.target.value;
                  handleArrayFieldChange('key_levels', updated);
                }}
                className="border p-2 rounded"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const updated = formData.key_levels.filter((_, i) => i !== idx);
                handleArrayFieldChange('key_levels', updated);
              }}
              className="text-red-500 hover:text-red-700"
              disabled={formData.key_levels.length === 1}
            >Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayFieldChange('key_levels', [...formData.key_levels, { level_type: '', price: '' }])}
          className="text-blue-500 hover:text-blue-700"
        >+ Add Key Level</button>
      </div>

      {/* Participants Section */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Participants</h3>
        {formData.participants && formData.participants.map((p, idx) => (
          <div key={idx} className="flex gap-2 items-end mb-2">
            <div>
              <label className="block text-xs">User ID</label>
              <input
                value={p.user}
                onChange={e => {
                  const updated = [...formData.participants];
                  updated[idx].user = e.target.value;
                  handleArrayFieldChange('participants', updated);
                }}
                className="border p-2 rounded"
                placeholder="User ID"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const updated = formData.participants.filter((_, i) => i !== idx);
                handleArrayFieldChange('participants', updated);
              }}
              className="text-red-500 hover:text-red-700"
              disabled={formData.participants.length === 1}
            >Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayFieldChange('participants', [...(formData.participants || []), { user: '' }])}
          className="text-blue-500 hover:text-blue-700"
        >+ Add Participant</button>
      </div>

      {/* Trade Setups Section */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Trade Setups</h3>
        {formData.trade_setups.map((setup, idx) => (
          <div key={idx} className="flex gap-2 items-end mb-2">
            <input
              value={setup}
              onChange={e => {
                const updated = [...formData.trade_setups];
                updated[idx] = e.target.value;
                handleArrayFieldChange('trade_setups', updated);
              }}
              className="border p-2 rounded flex-1"
              placeholder="Setup"
            />
            <button
              type="button"
              onClick={() => {
                const updated = formData.trade_setups.filter((_, i) => i !== idx);
                handleArrayFieldChange('trade_setups', updated);
              }}
              className="text-red-500 hover:text-red-700"
              disabled={formData.trade_setups.length === 1}
            >Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayFieldChange('trade_setups', [...formData.trade_setups, ''])}
          className="text-blue-500 hover:text-blue-700"
        >+ Add Trade Setup</button>
      </div>

      {/* Positives Section */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Positives</h3>
        {formData.positives.map((pos, idx) => (
          <div key={idx} className="flex gap-2 items-end mb-2">
            <input
              value={pos}
              onChange={e => {
                const updated = [...formData.positives];
                updated[idx] = e.target.value;
                handleArrayFieldChange('positives', updated);
              }}
              className="border p-2 rounded flex-1"
              placeholder="Positive Point"
            />
            <button
              type="button"
              onClick={() => {
                const updated = formData.positives.filter((_, i) => i !== idx);
                handleArrayFieldChange('positives', updated);
              }}
              className="text-red-500 hover:text-red-700"
              disabled={formData.positives.length === 1}
            >Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayFieldChange('positives', [...formData.positives, ''])}
          className="text-blue-500 hover:text-blue-700"
        >+ Add Positive</button>
      </div>

      {/* Negatives Section */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Negatives</h3>
        {formData.negatives.map((neg, idx) => (
          <div key={idx} className="flex gap-2 items-end mb-2">
            <input
              value={neg}
              onChange={e => {
                const updated = [...formData.negatives];
                updated[idx] = e.target.value;
                handleArrayFieldChange('negatives', updated);
              }}
              className="border p-2 rounded flex-1"
              placeholder="Negative Point"
            />
            <button
              type="button"
              onClick={() => {
                const updated = formData.negatives.filter((_, i) => i !== idx);
                handleArrayFieldChange('negatives', updated);
              }}
              className="text-red-500 hover:text-red-700"
              disabled={formData.negatives.length === 1}
            >Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayFieldChange('negatives', [...formData.negatives, ''])}
          className="text-blue-500 hover:text-blue-700"
        >+ Add Negative</button>
      </div>

      <input
        name="last_seen"
        value={formData.last_seen ? formData.last_seen.substring(0, 10) : ''}
        onChange={handleFormChange}
        type="date"
        className="border p-2 rounded"
      />

      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleFormChange}
        placeholder="Notes"
        className="w-full border p-2 rounded"
      />

      {/* Demand-Supply Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="follows_demand_supply"
          checked={formData.follows_demand_supply}
          onChange={handleFormChange}
        />
        <label>Follows Demand Supply</label>
      </div>

      {/* Buttons */}
      <div className=" justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {priceAction ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default AddPriceActionForm;
