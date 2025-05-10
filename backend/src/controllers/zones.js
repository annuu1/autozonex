const { identifyDemandZones } = require('../services/zones');
const Zone = require('../models/Zone');

const getDemandZones = async (req, res) => {
  try {
    const { ticker } = req.params;
    const timeFrame = req.params.timeFrame || '1d'; // Default to '1d'

    // Validate timeFrame
    if (!['1d', '1wk', '1mo'].includes(timeFrame)) {
      return res.status(400).json({ message: 'Invalid timeFrame. Use 1d, 1wk, or 1mo.' });
    }

    // Validate ticker (basic check for NSE/BSE format)
    if (!ticker.match(/^[A-Z0-9]+\.(NS|BO)$/)) {
      return res.status(400).json({ message: 'Invalid ticker format. Use NSE/BSE ticker (e.g., RELIANCE.NS)' });
    }

    // Check for cached zones (last 24 hours)
    // const cachedZones = await Zone.find({
    //   ticker,
    //   timeFrame,
    //   type: 'demand',
    //   createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    // });

    // if (cachedZones.length > 0) {
    //   return res.json(cachedZones);
    // }

    // Identify new zones
    const zones = await identifyDemandZones(ticker, timeFrame);
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDemandZones };