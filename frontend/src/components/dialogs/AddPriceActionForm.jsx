import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { searchSymbols } from '../../api/symbols';
import debounce from 'lodash.debounce';

const AddPriceActionForm = ({ onSubmit, onCancel, priceAction }) => {
  const { user } = useAuth();

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
    source_timeframes: [],
    key_levels: [],
    trade_setups: [],
    positives: [],
    negatives: [],
  });

  // Initialize form data with priceAction if provided
  useEffect(() => {
    if (priceAction) {
      setFormData(prev => ({
        ...prev,
        ...priceAction,
        userId: user._id,
      }));
    }
  }, [priceAction, user]);

  const [symbolOptions, setSymbolOptions] = useState([]);
  const [symbolInput, setSymbolInput] = useState('');

  useEffect(() => {
    if (priceAction) {
      setFormData(prev => ({
        ...prev,
        ...priceAction,
        userId: user._id,
      }));
      setSymbolInput(priceAction.symbol?.symbol || ''); // assuming populated symbol
    }
  }, [priceAction, user]);

  const handleSymbolChange = (e) => {
    const value = e.target.value;
    setSymbolInput(value);
    debouncedSearch(value);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selected = symbolOptions.find((sym) => sym.symbol === symbolInput);

    if (!selected && !priceAction) {
      alert('Please select a valid symbol from suggestions.');
      return;
    }

    const dataToSubmit = {
      ...formData,
      symbol: selected ? selected._id : formData.symbol, // for edit keep existing symbol id
    };

    onSubmit(dataToSubmit);
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
    }, 300),
    []
  );

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
        className="min-w-36 border p-2 rounded"
      />

      <input
        name="volume_behavior"
        value={formData.volume_behavior}
        onChange={handleFormChange}
        placeholder="Volume Behavior"
        className="border p-2 rounded"
      />

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

      <textarea
        name="candle_behavior_notes"
        value={formData.candle_behavior_notes}
        onChange={handleFormChange}
        placeholder="Candle Behavior Notes"
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

      {/* Other Array Fields (Simple CSV string for now) */}
      <textarea
        value={formData.source_timeframes
          ?.map(
            (f) =>
              `${f.timeframe}-${f.zone_type}-${f.zone_price_range || ''}-${f.reason_price_reached_here || ''}`
          )
          .join('\n')}
        onChange={(e) =>
          handleArrayFieldChange(
            'source_timeframes',
            e.target.value
              .split('\n')
              .filter(Boolean)
              .map((line) => {
                const [
                  timeframe,
                  zone_type,
                  zone_price_range,
                  reason_price_reached_here,
                ] = line.split('-');
                return {
                  timeframe,
                  zone_type,
                  zone_price_range,
                  reason_price_reached_here,
                };
              })
          )
        }
        placeholder="Source Timeframes (one per line: 6M-Demand-2500-Strong reversal)"
        className="w-full border p-2 rounded"
      />

      <textarea
        value={formData.key_levels
          ?.map((k) => `${k.level_type}-${k.price}`)
          .join('\n')}
        onChange={(e) =>
          handleArrayFieldChange(
            'key_levels',
            e.target.value
              .split('\n')
              .filter(Boolean)
              .map((line) => {
                const [level_type, price] = line.split('-');
                return { level_type, price: Number(price) };
              })
          )
        }
        placeholder="Key Levels (one per line: Resistance-2550)"
        className="w-full border p-2 rounded"
      />

      <input
        value={formData.trade_setups?.join(',')}
        onChange={(e) =>
          handleArrayFieldChange(
            'trade_setups',
            e.target.value.split(',').map((v) => v.trim())
          )
        }
        placeholder="Trade Setups (comma separated)"
        className="border p-2 rounded"
      />

      <input
        value={formData.positives?.join(',')}
        onChange={(e) =>
          handleArrayFieldChange(
            'positives',
            e.target.value.split(',').map((v) => v.trim())
          )
        }
        placeholder="Positives (comma separated)"
        className="border p-2 rounded"
      />

      <input
        value={formData.negatives?.join(',')}
        onChange={(e) =>
          handleArrayFieldChange(
            'negatives',
            e.target.value.split(',').map((v) => v.trim())
          )
        }
        placeholder="Negatives (comma separated)"
        className="border p-2 rounded"
      />

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
