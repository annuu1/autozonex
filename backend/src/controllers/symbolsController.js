const Symbol = require('../models/Symbols');

// Get all symbols
exports.getAllSymbols = async (req, res) => {
  try {
    const symbols = await Symbol.find();
    res.json(symbols);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch symbols' });
  }
};

// Get a single symbol by ID
exports.getSymbolById = async (req, res) => {
  try {
    const symbol = await Symbol.findById(req.params.id);
    if (!symbol) {
      return res.status(404).json({ error: 'Symbol not found' });
    }
    res.json(symbol);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch symbol' });
  }
};

// Create a new symbol
exports.createSymbol = async (req, res) => {
  try {
    const { symbol, name, exchange, sector, industry, active } = req.body;
    const newSymbol = new Symbol({
      symbol,
      name,
      exchange,
      sector,
      industry,
      active
    });
    await newSymbol.save();
    res.status(201).json(newSymbol);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create symbol' });
  }
};

// Update a symbol by ID
exports.updateSymbol = async (req, res) => {
  try {
    const updated = await Symbol.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Symbol not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update symbol' });
  }
};

// Delete a symbol by ID
exports.deleteSymbol = async (req, res) => {
  try {
    const deleted = await Symbol.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Symbol not found' });
    }
    res.json({ message: 'Symbol deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete symbol' });
  }
};

//add multiple symbols at once
exports.addMultipleSymbols = async (req, res) => {
  try {
    const symbols = req.body.symbols.map((sym)=>({symbol: sym}));
    const newSymbols = await Symbol.insertMany(symbols);
    res.status(201).json(newSymbols);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create symbols' });
  }
}

// Search symbols by term (symbol or name)
exports.searchSymbols = async (req, res) => {
  try {
    const { term } = req.params;
    if (!term || term.trim() === "") {
      return res.status(400).json({ error: "Search term is required" });
    }

    // Case-insensitive partial match on symbol or name
    const regex = new RegExp(term, "i");
    const results = await Symbol.find({
      $or: [
        { symbol: regex },
        { name: regex }
      ]
    }).limit(10); // Limit results for performance

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to search symbols" });
  }
};
