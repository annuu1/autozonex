import yahooFinance from 'yahoo-finance2';

async function fetchStockData(ticker, timeFrame, period) {
    try {
        const today = new Date();
        const fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(today.getDate() - 1);
    
        const queryOptions = {
          period1: fiveDaysAgo,
          period2: today,
          interval: '5m',
        };
    
        const data = await yahooFinance.chart('ABB.NS', queryOptions);
    
        console.log('5-minute candle data for ABB.NS:', data);
      } catch (error) {
        console.error('Error fetching 5-minute data:', error);
      }
}

module.exports = { fetchStockData };