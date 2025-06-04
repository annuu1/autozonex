const PriceAction = require("../models/PriceAction");

// Create a new PriceAction
exports.createPriceAction = async (req, res) => {
  try {
    // Only allow fields defined in the schema
    const {
      userId,
      symbol,
      follows_demand_supply,
      source_timeframes,
      confidence_score,
      key_levels,
      trade_setups,
      positives,
      negatives,
      notes,
      last_seen,
      trend_direction_HTF,
      current_EMA_alignment,
      volume_behavior,
      candle_behavior_notes,
    } = req.body;

    const priceAction = new PriceAction({
      userId,
      symbol,
      follows_demand_supply,
      source_timeframes,
      confidence_score,
      key_levels,
      trade_setups,
      positives,
      negatives,
      notes,
      last_seen,
      trend_direction_HTF,
      current_EMA_alignment,
      volume_behavior,
      candle_behavior_notes,
    });

    const savedPriceAction = await priceAction.save();
    res.status(201).json(savedPriceAction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all PriceActions (optionally filter by userId or symbol)
exports.getAllPriceActions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.symbol) filter.symbol = req.query.symbol;
    const priceActions = await PriceAction.find(filter)
      .populate("userId")
      .populate("symbol");
    res.json(priceActions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single PriceAction by ID
exports.getPriceActionById = async (req, res) => {
  try {
    const priceAction = await PriceAction.findById(req.params.id)
      .populate("userId")
      .populate("symbol");
    if (!priceAction) {
      return res.status(404).json({ error: "PriceAction not found" });
    }
    res.json(priceAction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a PriceAction by ID
exports.updatePriceAction = async (req, res) => {
  try {
    // Only allow fields defined in the schema to be updated
    const updateFields = {};
    const allowedFields = [
      "userId",
      "symbol",
      "follows_demand_supply",
      "source_timeframes",
      "confidence_score",
      "key_levels",
      "trade_setups",
      "positives",
      "negatives",
      "notes",
      "last_seen",
      "trend_direction_HTF",
      "current_EMA_alignment",
      "volume_behavior",
      "candle_behavior_notes",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedPriceAction = await PriceAction.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updatedPriceAction) {
      return res.status(404).json({ error: "PriceAction not found" });
    }
    res.json(updatedPriceAction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a PriceAction by ID
exports.deletePriceAction = async (req, res) => {
  try {
    const deletedPriceAction = await PriceAction.findByIdAndDelete(req.params.id);
    if (!deletedPriceAction) {
      return res.status(404).json({ error: "PriceAction not found" });
    }
    res.json({ message: "PriceAction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLastSeen = async (req, res) => {
  let { lastSeen } = req.body;
  if(!lastSeen){
    lastSeen = new Date();
  }
  try {
    console.log(lastSeen);
    const updatedPriceAction = await PriceAction.findByIdAndUpdate(
      req.params.id,
      { last_seen: lastSeen },
      { new: true }
    );
    if (!updatedPriceAction) {
      return res.status(404).json({ error: "PriceAction not found" });
    }
    res.json(updatedPriceAction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
