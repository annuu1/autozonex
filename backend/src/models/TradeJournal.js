const mongoose = require('mongoose');

const TradeJournalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  tradeDate: { type: Date, required: true },
  symbol: { type: String, required: true },
  tradeType: { type: String, required: true, enum: ['Buy', 'Sell', 'Short', 'Cover'] },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  exitDate: {type: Date},
  quantity: { type: Number, required: true },
  positionSize: { type: Number, required: true },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  pnl: { type: Number },
  rateTrade: { type: Number },
  mode: { type: String, enum: ['Paper', 'Live'] },
  result: { type: String, enum: ['win', 'loss'] },
  fees: { type: Number },
  strategy: { type: String },
  tags: [String],
  status: {
    type: String,
    enum: ['Planned', 'Open', 'Closed', 'Cancelled', 'Paper'],
    default: 'Planned'
  },
  
  setupScreenshotUrl: { type: String },
  journalNotes: { type: String },
  emotionBefore: { type: String },
  emotionAfter: { type: String },
  
  broker: { type: String },
  market: { type: String },
  holdingPeriod: { type: String },
  riskRewardRatio: { type: String },
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

const TradeJournal = mongoose.model('TradeJournal', TradeJournalSchema);

module.exports = TradeJournal;