const mongoose = require('mongoose');

const StrategySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  indicators: [{ type: String }],
  riskRewardRatio: { type: String },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {
  timestamps: true
});

const Strategy = mongoose.model('Strategy', StrategySchema);

module.exports = Strategy;
