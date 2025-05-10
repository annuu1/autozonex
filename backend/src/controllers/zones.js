const { identifyDemandZones } = require('../services/zones');
const Zone = require('../models/Zone');

const getDemandZones = async (req, res) => {
  try {
    const { ticker, timeFrame = '1d' } = req.params;
    
    // Check if zones exist in DB (cached within last 24 hours)
    const cachedZones = await Zone.find({
      ticker,
      timeFrame,
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