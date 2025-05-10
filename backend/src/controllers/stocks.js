const yahooFinance = require('yahoo-finance2').default;

const getStockData = async (req, res) => {
  try {
    const { ticker } = req.params;
    const data = await yahooFinance.historical(ticker, {
      period1: '1y',
      interval: '1d'
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStockData };
