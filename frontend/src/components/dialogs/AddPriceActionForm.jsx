import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { searchSymbols } from "../../api/symbols";
import debounce from "lodash.debounce";

const AddPriceActionForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    symbol: "", // symbol id (this is what we submit)
    follows_demand_supply: false,
    trend_direction_HTF: "",
    current_EMA_alignment: "",
    notes: "",
    userId: user._id,
  });

  const [symbolOptions, setSymbolOptions] = useState([]);
  const [symbolInput, setSymbolInput] = useState("");

  const handleSymbolChange = (e) => {
    const value = e.target.value;
    setSymbolInput(value);
    debouncedSearch(value);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // find selected symbol from options
    const selected = symbolOptions.find((sym) => sym.symbol === symbolInput);

    if (!selected) {
      alert("Please select a valid symbol from suggestions.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      symbol: selected._id, // send symbol id
    };

    onSubmit(dataToSubmit);
  };

  // Debounced symbol search
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
        console.error("Error fetching symbols:", error);
      }
    }, 300),
    []
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          list="symbol-suggestions"
          value={symbolInput}
          onChange={handleSymbolChange}
          placeholder="Symbol"
          className="w-full border p-2 rounded"
          required
        />
        <datalist id="symbol-suggestions">
          {symbolOptions.map((sym) => (
            <option key={sym._id} value={sym.symbol} />
          ))}
        </datalist>
      </div>

      <input
        name="trend_direction_HTF"
        value={formData.trend_direction_HTF}
        onChange={handleFormChange}
        placeholder="Trend Direction HTF"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="current_EMA_alignment"
        value={formData.current_EMA_alignment}
        onChange={handleFormChange}
        placeholder="EMA Alignment"
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleFormChange}
        placeholder="Notes"
        className="w-full border p-2 rounded"
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="follows_demand_supply"
          checked={formData.follows_demand_supply}
          onChange={handleFormChange}
        />
        <label>Follows Demand Supply</label>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
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
          Add
        </button>
      </div>
    </form>
  );
};

export default AddPriceActionForm;
