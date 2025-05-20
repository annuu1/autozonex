const TradeJournal = require('../models/TradeJournal');

// Create a new trade journal entry
exports.createTradeJournal = async (req, res) => {
  try {
    console.log(req)
    req.body.userId = req.user._id;
    if(!req.body.strategy) {
      delete req.body.strategy;
    }
    const newTradeJournal = new TradeJournal(req.body);
    const savedTradeJournal = await newTradeJournal.save();
    res.status(201).json(savedTradeJournal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all trade journal entries for a user
exports.getAllTradeJournals = async (req, res) => {
  try {
    const tradeJournals = await TradeJournal.find({ userId: req.user._id });
    res.status(200).json(tradeJournals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific trade journal entry
exports.getTradeJournal = async (req, res) => {
  try {
    const tradeJournal = await TradeJournal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!tradeJournal) {
      return res.status(404).json({ message: 'Trade journal entry not found' });
    }
    res.status(200).json(tradeJournal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a trade journal entry
exports.updateTradeJournal = async (req, res) => {
  try {
    const updatedTradeJournal = await TradeJournal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTradeJournal) {
      return res.status(404).json({ message: 'Trade journal entry not found' });
    }
    res.status(200).json(updatedTradeJournal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a trade journal entry
exports.deleteTradeJournal = async (req, res) => {
  try {
    const deletedTradeJournal = await TradeJournal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deletedTradeJournal) {
      return res.status(404).json({ message: 'Trade journal entry not found' });
    }
    res.status(200).json({ message: 'Trade journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trade statistics for a user
exports.getTradeStatistics = async (req, res) => {
  try {
    const stats = await TradeJournal.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          totalPnL: { $sum: '$pnl' },
          avgPnL: { $avg: '$pnl' },
          totalFees: { $sum: '$fees' },
        }
      }
    ]);
    res.status(200).json(stats[0] || { totalTrades: 0, totalPnL: 0, avgPnL: 0, totalFees: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};