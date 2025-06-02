// Dashboard Controller
exports.getDashboardStats = (req, res) => {
  res.json({
    todaysDemandZones: 18,
    totalTrades: 45,
    winRate: 80
  });
};

exports.getDashboardPnL = (req, res) => {
  res.json({
    wins: 24,
    losses: 6
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