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
    let i = 0;

    while (i < candles.length) {
      // Step 1: Find leg-in candle (body > 50% of range)
      const currentCandle = candles[i];
      const body = Math.abs(currentCandle.close - currentCandle.open);
      const range = currentCandle.high - currentCandle.low;
      const isLegIn = body / range > 0.5;

      if (isLegIn) {
        const legIn = currentCandle;
        let baseCandles = [];
        let baseCount = 0;
        let j = i + 1;

        // Step 2: Find up to 5 base candles (body < 50% of range)
        while (j < candles.length && baseCount < 5) {
          const nextCandle = candles[j];
          const nextBody = Math.abs(nextCandle.close - nextCandle.open);
          const nextRange = nextCandle.high - nextCandle.low;
          const isBaseCandle = nextBody / nextRange < 0.5;

          if (isBaseCandle) {
            baseCandles.push(nextCandle);
            baseCount++;
            j++;
          } else {
            break; // Non-base candle found, stop collecting base candles
          }
        }

        // Step 3: Check for leg-out candle (green, closes above leg-in high)
        if (baseCount >= 1 && j < candles.length) {
          const legOut = candles[j];
          const isLegOutGreen = legOut.close > legOut.open;
          const isLegOutValid = legOut.close > legIn.high;

          // Step 4: Check for DBR or RBR pattern
          const isDBR = legIn.close < legIn.open && isLegOutGreen && isLegOutValid; // Red leg-in
          const isRBR = legIn.close > legIn.open && isLegOutGreen && isLegOutValid; // Green leg-in

          if (isDBR || isRBR) {
            // Step 5: Mark zone boundaries (body-to-wick method)
            const proximalLine = Math.max(...baseCandles.map(c => Math.max(c.close, c.open)));
            const distalLine = Math.min(...baseCandles.map(c => c.low));

            // Step 6: Calculate trade score
            const freshness = await getFreshness(ticker, timeFrame, proximalLine, distalLine);
            const strength = (legOut.high - legOut.low) > (baseCandles[baseCandles.length - 1].high - baseCandles[baseCandles.length - 1].low) * 2 ? 2 : 1;
            const timeAtBase = baseCount <= 3 ? 2 : baseCount <= 5 ? 1 : 0;
            const tradeScore = freshness + strength + timeAtBase;

            // Step 7: Store zone if trade score is sufficient
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
                legOutDate: new Date(legOut.date),
              };
              zones.push(zone);
            }
          }
        }

        // Move to the candle after the last base candle or leg-out
        i = j;
      } else {
        i++; // Move to next candle if no leg-in found
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