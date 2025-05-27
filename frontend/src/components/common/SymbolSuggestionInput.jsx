// SymbolSuggestionInput.jsx
import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { searchSymbols } from '../../api/symbols';

const SymbolSuggestionInput = ({
  value,
  onChange,
  placeholder = "Symbol",
  name = "symbol",
  id = "symbol-suggestions",
  ...props
}) => {
  const [symbolOptions, setSymbolOptions] = useState([]);

  // Debounced search function
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
        setSymbolOptions([]);
      }
    }, 500),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(e); // Let parent manage the value
    debouncedSearch(inputValue);
  };

  return (
    <div>
      <input
        list={id}
        value={value}
        onChange={handleInputChange}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        className="border p-2 rounded"
        {...props}
      />
      <datalist id={id}>
        {symbolOptions.map((sym) => (
          <option key={sym._id} value={sym.symbol} />
        ))}
      </datalist>
    </div>
  );
};

export default SymbolSuggestionInput;
