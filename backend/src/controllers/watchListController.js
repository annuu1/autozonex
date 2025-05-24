const WatchList = require('../models/WatchList');
const Symbol = require('../models/Symbols');

// Create a new watchlist
exports.createWatchList = async (req, res) => {
  try {
    const { name, symbols } = req.body;
    if (!name || !Array.isArray(symbols)) {
      return res.status(400).json({ message: 'Name and symbols are required.' });
    }

    // Optionally, validate that all symbols exist in the Symbols collection
    // const foundSymbols = await Symbol.find({ symbol: { $in: symbols } });
    // if (foundSymbols.length !== symbols.length) {
    //   return res.status(400).json({ message: 'One or more symbols are invalid.' });
    // }

    const watchList = new WatchList({
      user: req.user.id,
      name,
      symbols,
    });

    await watchList.save();
    res.status(201).json(watchList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all watchlists for the authenticated user
exports.getWatchLists = async (req, res) => {
  try {
    const watchLists = await WatchList.find({ user: req.user.id });
    res.json(watchLists);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single watchlist by ID
exports.getWatchListById = async (req, res) => {
  try {
    const watchList = await WatchList.findOne({ _id: req.params.id, user: req.user.id });
    if (!watchList) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    res.json(watchList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a watchlist (name and/or symbols)
exports.updateWatchList = async (req, res) => {
  try {
    const { name, symbols } = req.body;
    const update = {};
    if (name) update.name = name;
    if (symbols) update.symbols = symbols;

    const watchList = await WatchList.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: update },
      { new: true }
    );

    if (!watchList) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    res.json(watchList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a watchlist
exports.deleteWatchList = async (req, res) => {
  try {
    const watchList = await WatchList.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!watchList) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    res.json({ message: 'Watchlist deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a symbol to a watchlist
exports.addSymbolToWatchList = async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required.' });
    }

    // Optionally, validate symbol exists in Symbols collection
    // const foundSymbol = await Symbol.findOne({ symbol });
    // if (!foundSymbol) {
    //   return res.status(400).json({ message: 'Symbol does not exist.' });
    // }

    const watchList = await WatchList.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $addToSet: { symbols: symbol } },
      { new: true }
    );

    if (!watchList) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    res.json(watchList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove a symbol from a watchlist
exports.removeSymbolFromWatchList = async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required.' });
    }

    const watchList = await WatchList.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $pull: { symbols: symbol } },
      { new: true }
    );

    if (!watchList) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    res.json(watchList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
