const yahooFinance = require('yahoo-finance2').default;
const winston = require('winston');
const { fetchLTFdata } = require('../utils/yahooFinanceUtil');

// Retry utility for API calls
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Get candlestick data
const getCandles = async (req, res) => {
  const { ticker, timeFrame } = req.params;

  try {
    // Validate timeFrame
    if (!['1d', '1wk', '1mo'].includes(timeFrame)) {
      return res.status(400).json({ error: 'Invalid timeFrame. Use 1d, 1wk, or 1mo.' });
    }

    // Calculate date range (1 year ago to now)
    const period2 = new Date();
    const period1 = new Date(period2);
    period1.setFullYear(period2.getFullYear() - 15);

    // Fetch historical data
    const candles = await retry(() =>
      yahooFinance.historical(ticker, {
        period1,
        period2,
        interval: timeFrame,
      })
    );

    if (!candles || candles.length < 10) {
      return res.status(400).json({ error: `Insufficient data for ${ticker}` });
    }

    // Map candles to frontend format
    const formattedCandles = candles.map(candle => ({
      time: candle.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
    }));

    res.status(200).json(formattedCandles);
  } catch (err) {
    winston.error(`Error fetching candles for ${ticker}: ${err.message || err}`);
  
    const safeMessage = typeof err === 'string' ? err 
                       : err?.message || 'Unknown error occurred';
  
    res.status(500).json({ error: safeMessage });
  }
  
};

const getLTFCandles = async (req, res) => {
  const { ticker, timeFrame } = req.params;
  try {
    const candles = await fetchLTFdata(ticker, {}, timeFrame );
    res.status(200).json(candles);
  } catch (error) {
    winston.error(`Error fetching LTF candles for ${ticker}: ${error.message || error}`);
    const safeMessage = typeof error === 'string' ? error : error?.message || 'Unknown error occurred';
    res.status(500).json({ error: safeMessage });
  }
}

module.exports = { getCandles, getLTFCandles };