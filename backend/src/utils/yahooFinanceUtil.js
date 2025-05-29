const yahooFinance = require('yahoo-finance2').default;
const logger = require('./logger');

// Suppress historical() deprecation warning
yahooFinance.suppressNotices(['ripHistorical']);

// Retry utility for API calls
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) {
        logger.error(`Retry failed after ${retries} attempts: ${err.message}`);
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Normalize date input to Date object
const toDate = (input) => {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  if (typeof input === 'string' && !isNaN(Date.parse(input))) return new Date(input);
  throw new Error(`Invalid date format: ${input}`);
};

// Aggregate 5m candles into custom intervals (75m, 125m) with complete intervals only
const aggregateCandles = (candles, targetIntervalMinutes, marketOpen = '09:15:00', marketClose = '15:30:00') => {
  if (!candles || candles.length === 0) {
    throw new Error('No candles provided for aggregation');
  }

  // Validate target interval
  if (![75, 125].includes(targetIntervalMinutes)) {
    throw new Error(`Unsupported aggregation interval: ${targetIntervalMinutes}m. Only 75m and 125m are supported`);
  }

  // Market hours: 9:15 AM to 3:30 PM IST (375 minutes)
  const marketOpenTime = 9 * 60 + 15; // 9:15 AM in minutes
  const marketCloseTime = 15 * 60 + 30; // 3:30 PM in minutes
  const candlesPerInterval = targetIntervalMinutes / 5; // Number of 5m candles per target interval

  if (!Number.isInteger(candlesPerInterval)) {
    throw new Error(`Target interval (${targetIntervalMinutes}m) must be divisible by 5m`);
  }

  const aggregated = [];
  let currentGroup = [];
  let currentDay = null;
  let intervalStartMinutes = marketOpenTime;

  candles.forEach((candle) => {
    const date = new Date(candle.date);
    const timeInMinutes = date.getHours() * 60 + date.getMinutes();
    const day = date.toISOString().split('T')[0];

    // Only process candles within market hours
    if (timeInMinutes < marketOpenTime || timeInMinutes >= marketCloseTime) {
      return;
    }

    // Start a new day
    if (day !== currentDay) {
      currentDay = day;
      currentGroup = [];
      intervalStartMinutes = marketOpenTime; // Reset to market open
    }

    // Check if candle aligns with the current interval
    const minutesSinceOpen = timeInMinutes - marketOpenTime;
    const currentInterval = Math.floor(minutesSinceOpen / targetIntervalMinutes);
    const expectedIntervalStart = marketOpenTime + currentInterval * targetIntervalMinutes;
    const expectedIntervalEnd = expectedIntervalStart + targetIntervalMinutes;

    if (timeInMinutes >= expectedIntervalStart && timeInMinutes < expectedIntervalEnd) {
      currentGroup.push(candle);
    }

    // Aggregate when we have a complete interval
    if (currentGroup.length === candlesPerInterval) {
      const open = currentGroup[0].open;
      const close = currentGroup[currentGroup.length - 1].close;
      const high = Math.max(...currentGroup.map(c => c.high));
      const low = Math.min(...currentGroup.map(c => c.low));
      const volume = currentGroup.reduce((sum, c) => sum + c.volume, 0);

      // Convert date to Unix timestamp in seconds for lightweight-charts
      const time = Math.floor(new Date(currentGroup[0].date).getTime() / 1000);

      aggregated.push({
        time, // Unix timestamp in seconds
        open,
        high,
        low,
        close,
        volume,
      });

      currentGroup = [];
      intervalStartMinutes = expectedIntervalEnd; // Move to next interval
    }
  });

  // Discard incomplete intervals
  if (currentGroup.length > 0 && currentGroup.length < candlesPerInterval) {
    logger.debug(`Discarded incomplete interval for ${targetIntervalMinutes}m on ${currentDay}: ${currentGroup.length} candles`);
  }

  return aggregated;
};

// Fetch stock data using historical() (normalized to consistent format)
// TODO: Replace historical() with chart() or another provider (e.g., Alpha Vantage) when stable
const fetchStockData = async (ticker, options, interval = '1d') => {
  try {
    // Validate inputs
    if (!ticker || !ticker.match(/^[A-Z0-9]+\.(NS|BO)$/)) {
      throw new Error(`Invalid ticker format: ${ticker}. Use NSE/BSE ticker (e.g., RELIANCE.NS)`);
    }
    if (!options || !options.interval) {
      throw new Error('Missing required option: interval');
    }

    // Normalize period1 and period2 to Date objects
    const period1 = toDate(options.period1);
    const period2 = toDate(options.period2);

    // Map options to historical() format
    const historicalOptions = {
      period1, // Date object
      period2, // Date object
      interval: options.interval, // e.g., '1d', '1wk', '1mo'
    };

    logger.debug(`Fetching data for ${ticker} with options: ${JSON.stringify({
      period1: period1.toISOString(),
      period2: period2.toISOString(),
      interval: options.interval,
    })}`);

    // Fetch data using historical()
    const result = await retry(() => yahooFinance.historical(ticker, historicalOptions));

    if (!result || result.length === 0) {
      throw new Error(`No data returned for ${ticker}`);
    }

    // Normalize historical() output to consistent format
    const candles = await retry(() =>
      yahooFinance.historical(ticker, {
        period1,
        period2,
        interval,
      })
    );

    if (candles.length === 0) {
      throw new Error(`No valid candles after normalization for ${ticker}`);
    }

    logger.info(`Fetched ${candles.length} candles for ${ticker} (${options.interval})`);
    return candles;
  } catch (err) {
    logger.error(`Error fetching stock data for ${ticker}: ${err.message}`);
    throw err;
  }
};


// Supports lower time frames (5m, 15m, 30m, 45m, 60m, 4h) and custom intervals (75m, 125m)
const fetchLTFdata = async (ticker, options, interval = '75m') => {
  try {
    // Validate inputs
    if (!ticker || !ticker.match(/^[A-Z0-9]+\.(NS|BO)$/)) {
      throw new Error(`Invalid ticker format: ${ticker}. Use NSE/BSE ticker (e.g., RELIANCE.NS)`);
    }
    if (!options || !options.interval) {
      throw new Error('Missing required option: interval');
    }

    // Supported intervals
    const supportedIntervals = ['5m', '15m', '30m', '60m', '1d', '1wk', '1mo', '75m', '125m'];
    if (!supportedIntervals.includes(interval)) {
      throw new Error(`Unsupported interval: ${interval}. Supported: ${supportedIntervals.join(', ')}`);
    }

    // Normalize period1 and period2 to Date objects
    const period1 = toDate(options.period1);
    const period2 = toDate(options.period2);

    // Determine fetch method and interval
    const historicalIntervals = ['1d', '1wk', '1mo'];
    const chartIntervals = ['5m', '15m', '30m', '60m'];
    const aggregateIntervals = {
      '75m': 75,
      '125m': 125,
    };

    let candles;
    if (historicalIntervals.includes(interval)) {
      // Use historical() for daily, weekly, monthly
      const historicalOptions = {
        period1,
        period2,
        interval,
      };

      logger.debug(`Fetching historical data for ${ticker} with options: ${JSON.stringify({
        period1: period1.toISOString(),
        period2: period2.toISOString(),
        interval,
      })}`);

      candles = await retry(() => yahooFinance.historical(ticker, historicalOptions));
    } else {
      // Use chart() for intraday intervals or as base for aggregation
      const fetchInterval = aggregateIntervals[interval] ? '5m' : interval;
      if (!chartIntervals.includes(fetchInterval)) {
        throw new Error(`Interval ${interval} not supported. Use 5m, 15m, 30m, 60m, 75m, 125m, 1d, 1wk, or 1mo`);
      }

      const chartOptions = {
        period1,
        period2,
        interval: fetchInterval,
      };

      logger.debug(`Fetching chart data for ${ticker} with options: ${JSON.stringify({
        period1: period1.toISOString(),
        period2: period2.toISOString(),
        interval: fetchInterval,
      })}`);

      const result = await retry(() => yahooFinance.chart(ticker, chartOptions));
      candles = result.quotes; // chart() returns data in result.quotes
    }

    if (!candles || candles.length === 0) {
      throw new Error(`No data returned for ${ticker}`);
    }

    // Normalize candles to lightweight-charts format
    const normalizedCandles = candles.map(candle => ({
      time: Math.floor(new Date(candle.date).getTime() / 1000), // Unix timestamp in seconds
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
    }));

    // Aggregate for custom intervals if needed
    let finalCandles = normalizedCandles;
    if (aggregateIntervals[interval]) {
      finalCandles = aggregateCandles(normalizedCandles, aggregateIntervals[interval]);
    }

    if (finalCandles.length === 0) {
      throw new Error(`No valid candles after processing for ${ticker}`);
    }

    logger.info(`Fetched ${finalCandles.length} candles for ${ticker} (${interval})`);
    return finalCandles;
  } catch (err) {
    logger.error(`Error fetching stock data for ${ticker}: ${err.message}`);
    throw err;
  }
};
module.exports = { fetchStockData, fetchLTFdata };