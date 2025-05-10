const yahooFinance = require('yahoo-finance2').default;
const Zone = require('../models/Zone');
const winston = require('winston');

// Utility functions for technical indicators
const calculateRSI = (closes, period = 14) => {
  if (closes.length < period + 1) return null;
  
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / (avgLoss || 1); // Avoid division by zero
  return 100 - (100 / (1 + rs));
};

const calculateEMA = (closes, period) => {
  if (closes.length < period) return null;
  
  const k = 2 / (period + 1);
  let ema = closes[0]; // Start with first close
  for (let i = 1; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
};

// Main function to identify demand zones
const identifyDemandZones = async (ticker, timeFrame = '1d') => {
  try {
    // Fetch historical data (1 year, adjustable)
    const candles = await yahooFinance.historical(ticker, {
      period1: '1y',
      interval: timeFrame,
    });
    
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

            // Calculate technical indicators
            const closes = candles.slice(0, i + 1).map(c => c.close);
            const rsi = calculateRSI(closes);
            const ema20 = calculateEMA(closes, 20);
            const ema50 = calculateEMA(closes, 50);
            const ema200 = calculateEMA(closes, 200);

            // Validate zone
            const isValid =
              tradeScore >= 4 && // Minimum score
              (rsi < 30 || (legOut.close >= ema50 && rsi > 30)); // RSI oversold or EMA support

            if (isValid) {
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
                technicals: {
                  rsi,
                  ema20,
                  ema50,
                  ema200,
                  stochastic: { k: null, d: null }, // Placeholder for future implementation
                },
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

// Check zone freshness (untested, tested once, or twice)
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

module.exports = { identifyDemandZones };