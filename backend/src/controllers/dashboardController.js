const TradeJournal = require('../models/TradeJournal');

// Dashboard Controller
exports.getDashboardStats = async (req, res) => {
  const totalTrades = await TradeJournal.find({});
  const totalClosed = await TradeJournal.find({ status: "Closed" });
  const wins = await TradeJournal.find({ result: 'win', status: 'Closed' });
  const losses = await TradeJournal.find({ result: 'loss', status: 'Closed' });

  const winRate = totalClosed.length > 0 
    ? (wins.length / totalClosed.length) * 100 
    : 0;

  res.json({
    todaysDemandZones: 18,
    totalTrades: totalTrades.length,
    winRate: winRate.toFixed(2),
    wins: wins.length,
    losses: losses.length,
    totalClosed: totalClosed.length
  });
};


exports.getDashboardPnL = async (req, res) => {
  const totalTrades = await TradeJournal.find({});
  const wins = await TradeJournal.find({ result: 'win', status: 'Closed' });
  const losses = await TradeJournal.find({ result: 'loss', status: 'Closed' });
  res.json({
    wins: wins.length,
    losses: losses.length
  });
};

exports.getDashboardTradeScore = (req, res) => {
  res.json({
    scores: [
      { name: 'Trade 1', score: 80 },
      { name: 'Trade 2', score: 90 },
      { name: 'Trade 3', score: 70 }
    ]
  });
};

exports.getDashboardZones = (req, res) => {
  res.json({
    zones: [
      { id: 1, name: 'Zone A', status: 'active' },
      { id: 2, name: 'Zone B', status: 'inactive' }
    ]
  });
};