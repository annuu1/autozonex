const { identifyDemandZones, identifyDailyDemandZones } = require('../services/zones');
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
const getAllDemandZones = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const zones = await Zone.find({})
    .sort({ legOutDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalZones = await Zone.countDocuments();

    res.status(200).json({
      total: totalZones,
      page: page,
      pages: Math.ceil(totalZones / limit),
      data: zones
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDailyDemandZones = async (req, res) => {
  try {
    const { timeFrame = '1d', tickers,targetDate } = req.query;
    const tickerList = tickers ? tickers.split(',') : undefined;

    //validate user, allow only if user is admin
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Validate timeFrame
    if (!['1d', '1wk', '1mo'].includes(timeFrame)) {
      return res.status(400).json({ message: 'Invalid timeFrame. Use 1d, 1wk, or 1mo.' });
    }

    // Validate tickers if provided
    if (tickerList) {
      for (const ticker of tickerList) {
        if (!ticker.match(/^[A-Z0-9]+\.(NS|BO)$/)) {
          return res.status(400).json({ message: `Invalid ticker format: ${ticker}. Use NSE/BSE ticker (e.g., RELIANCE.NS)` });
        }
      }
    }

    const zones = await identifyDailyDemandZones(timeFrame, tickerList, targetDate);
    res.json({
      total: zones.length,
      data: zones,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDemandZones, getAllDemandZones, getDailyDemandZones };