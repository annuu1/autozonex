const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    index: true, // Index for fast queries by ticker
  },
  timeFrame: {
    type: String,
    required: true,
    enum: ['1d', '1wk', '1mo'], // Updated to '1wk'
  },
  type: {
    type: String,
    required: true,
    enum: ['demand', 'supply'],
  },
  pattern: {
    type: String,
    required: true,
    enum: ['DBR', 'RBR', 'RBD', 'DBD'],
  },
  proximalLine: {
    type: Number,
    required: true,
  },
  distalLine: {
    type: Number,
    required: true,
  },
  tradeScore: {
    type: Number,
    required: true,
  },
  freshness: {
    type: Number,
    default: 3, // 3 (untested), 1.5 (tested once), 0 (tested twice)
  },
  strength: {
    type: Number,
    required: true,
  },
  timeAtBase: {
    type: Number,
    required: true,
  },
  legOutDate: {
    type: Date,
    required: true, // New field for leg-out candle date
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '90d', // Auto-remove after 90 days
  },
});

// Compound index for efficient queries
ZoneSchema.index({ ticker: 1, timeFrame: 1, createdAt: -1 });

module.exports = mongoose.model('Zone', ZoneSchema);