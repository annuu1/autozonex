const yahooFinance = require('yahoo-finance2').default;
const Zone = require('../models/Zone');
const winston = require('winston');

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

// Check zone freshness
const getFreshness = async (ticker, timeFrame, proximalLine, distalLine) => {
  const tests = await Zone.countDocuments({
    ticker,
    timeFrame,
    proximalLine: { $gte: distalLine, $lte: proximalLine },
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
  });

  if (tests === 0) return 3; // Untested
  if (tests === 1) return 1.5; // Tested once
  return 0; // Tested twice or more
};

// Main function to identify demand zones
const identifyDemandZones = async (ticker, timeFrame = '1d') => {
  try {
    // Validate timeFrame
    if (!['1d', '1wk', '1mo'].includes(timeFrame)) {
      throw new Error('Invalid timeFrame. Use 1d, 1wk, or 1mo.');
    }

    // Calculate date range (1 year ago to now)
    const period2 = new Date(); // Current date
    const period1 = new Date(period2);
    period1.setFullYear(period2.getFullYear() - 1); // 1 year ago

    // Fetch historical data
    const candles = await retry(() =>
      yahooFinance.historical(ticker, {
        period1,
        period2,
        interval: timeFrame,
      })
    );

    if (!candles || candles.length < 10) {
      throw new Error(`Insufficient data for ${ticker}`);
    }

    const zones = [];
    let baseCount = 0;
    let baseCandles = [];

    for (let i = 2; i < candles.length; i++) {
      const legIn = candles[i - 2];
      const current = candles[i - 1];
      const legOut = candles[i];

      // Calculate candle properties
      const currentBody = Math.abs(current.close - current.open);
      const currentRange = current.high - current.low;
      const isBaseCandle = currentBody / currentRange < 0.5;

      if (isBaseCandle) {
        baseCount++;
        baseCandles.push(current);
      } else {
        if (baseCount >= 1 && baseCount <= 5) {
          // Check for DBR or RBR
          const isDBR =
            legIn.close < legIn.open && // Red leg-in
            legOut.close > legOut.open && // Green leg-out
            legOut.close > legIn.high; // Closes above leg-in high

          const isRBR =
            legIn.close > legIn.open && // Green leg-in
            legOut.close > legOut.open && // Green leg-out
            legOut.close > legIn.high; // Closes above leg-in high

          if (isDBR || isRBR) {
            // Mark zone boundaries (body-to-wick method)
            const proximalLine = Math.max(...baseCandles.map(c => Math.max(c.close, c.open)));
            const distalLine = Math.min(...baseCandles.map(c => c.low));

            // Calculate trade score
            const freshness = await getFreshness(ticker, timeFrame, proximalLine, distalLine);
            const strength = legOut.high - legOut.low > (current.high - current.low) * 2 ? 2 : 1;
            const timeAtBase = baseCount <= 3 ? 2 : baseCount <= 5 ? 1 : 0;
            const tradeScore = freshness + strength + timeAtBase;

            // Store zone if trade score is sufficient
            if (tradeScore >= 4) {
              const zone = {
                ticker,
                timeFrame,
                type: 'demand',
                pattern: isDBR ? 'DBR' : 'RBR',
                proximalLine,
                distalLine,
                tradeScore,
                freshness,
                strength,
                timeAtBase,
                legOutDate: new Date(legOut.date), // Add leg-out candle date
              };

              zones.push(zone);
            }
          }
        }
        // Reset base count
        baseCount = 0;
        baseCandles = [];
      }
    }

    // Save zones to MongoDB
    if (zones.length > 0) {
      await Zone.insertMany(zones);
      winston.info(`Saved ${zones.length} demand zones for ${ticker} (${timeFrame})`);
    }

    return zones;
  } catch (err) {
    winston.error(`Error identifying demand zones for ${ticker}: ${err.message}`);
    throw err;
  }
};

module.exports = { identifyDemandZones };