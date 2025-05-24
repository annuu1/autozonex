const mongoose = require('mongoose');

const SymbolSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  exchange: {
    type: String,
    required: false,
    trim: true
  },
  sector: {
    type: String,
    required: false,
    trim: true
  },
  industry: {
    type: String,
    required: false,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Symbol = mongoose.model('Symbol', SymbolSchema);

module.exports = Symbol;
