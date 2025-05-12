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

module.exports = { fetchStockData };