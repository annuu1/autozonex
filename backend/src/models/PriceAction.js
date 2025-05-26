const mongoose = require("mongoose");

const PriceActionSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symbol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Symbol",
    required: true,
  },
  follows_demand_supply: {
    type: Boolean,
    default: false,
  },
  source_timeframes: [
    {
      timeframe: {
        type: String, // "6M", "3M", "1M", "1W", "1Y"
        required: true,
      },
      zone_type: {
        type: String, // "Demand" or "Supply"
        required: true,
      },
      zone_price_range: {
        type: String, // "2500-2600"
        required: false,
      },
      reason_price_reached_here: {
        type: String,
        required: false,
      },
    },
  ],
  participants:[{
    user:{type:mongoose.Schema.Types.ObjectId, ref: "User" }
  }],
  confidence_score: { type: Number, min: 1, max: 10 },
  key_levels: [
    {
      level_type: String,
      price: Number,
    }
  ],
  trade_setups: [
    {
      type: String, // "WIT", "MIT", "125EMA touch", etc.
    },
  ],
  positives: [
    {
      type: String,
    },
  ],
  negatives: [
    {
      type: String,
    },
  ],
  notes: {
    type: String,
  },
  last_seen: {
    type: Date,
  },
  trend_direction_HTF: {
    type: String, // "Uptrend", "Downtrend", "Sideways"
  },
  current_EMA_alignment: {
    type: String, // "Above all EMAs", "Between EMAs", "Below all EMAs"
  },
  volume_behavior: {
    type: String, // "High", "Average", "Low"
  },
  candle_behavior_notes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("PriceAction", PriceActionSchema);
