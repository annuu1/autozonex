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
    enum: ['1d', '1w', '1mo'], // Daily, weekly, monthly
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
  technicals: {
    rsi: Number,
    ema20: Number,
    ema50: Number,
    ema200: Number,
    stochastic: { k: Number, d: Number },
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