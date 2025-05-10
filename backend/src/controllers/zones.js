const { identifyDemandZones } = require('../services/zones');
const Zone = require('../models/Zone');

const getDemandZones = async (req, res) => {
  try {
    const { ticker } = req.params;
    const timeFrame = req.params.timeFrame || '1d'; // Default to '1d' if not provided

    // Validate timeFrame
    if (!['1d', '1w', '1mo'].includes(timeFrame)) {
      return res.status(400).json({ message: 'Invalid timeFrame. Use 1d, 1w, or 1mo.' });
    }

    // Check for cached zones (last 24 hours)
    const cachedZones = await Zone.find({
      ticker,
      timeFrame,
      type: 'demand',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (cachedZones.length > 0) {
      return res.json(cachedZones);
    }

    // Identify new zones
    const zones = await identifyDemandZones(ticker, timeFrame);
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDemandZones };