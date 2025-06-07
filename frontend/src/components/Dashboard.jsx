import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled } from '@mui/material';
import { TrendingUp, ShoppingCart, Inventory, People, MonetizationOn, Warning } from '@mui/icons-material';
import { designTokens } from '../utils/designTokens';
import { fetchDashboardStats, fetchDashboardTradeScore, fetchDashboardZones } from '../api/dashboard';

// Define StyledCard to match the inspiration's card styling
const StyledCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius * 3,
  border: `1px solid ${designTokens.colors.inputBorder}`,
  padding: theme.spacing(3),
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

// Hardcoded data structured for API integration
const mockStats = {
  totalPnL: '$12,345.67',
  activeTrades: 23,
  winRate: '65.2%',
  watchlistCount: 15,
};

const mockActiveTrades = [
  { id: '#T12345', symbol: 'AAPL', strategy: 'Breakout', profitLoss: '$245.50', status: 'Open' },
  { id: '#T12344', symbol: 'TSLA', strategy: 'Swing', profitLoss: '-$150.75', status: 'Open' },
  { id: '#T12343', symbol: 'MSFT', strategy: 'Momentum', profitLoss: '$320.00', status: 'Closed' },
  { id: '#T12342', symbol: 'NVDA', strategy: 'Scalping', profitLoss: '$89.25', status: 'Open' },
];

const mockWatchlistAlerts = [
  { symbol: 'GOOGL', price: 175.25, threshold: 180.00 },
  { symbol: 'AMZN', price: 185.50, threshold: 190.00 },
  { symbol: 'SPY', price: 425.30, threshold: 430.00 },
];

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPnL: '$0.00', activeTrades: 0, winRate: '0%', watchlistCount: 0 });
  const [activeTrades, setActiveTrades] = useState([]);
  const [watchlistAlerts, setWatchlistAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsData, tradesData, alertsData] = await Promise.all([
          fetchDashboardStats(),
          fetchDashboardTradeScore(),
          fetchDashboardZones(),
        ]);
        setStats(statsData || mockStats);
        setActiveTrades(tradesData.trades || mockActiveTrades);
        setWatchlistAlerts(alertsData.alerts || mockWatchlistAlerts);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Fallback to mock data
        setStats(mockStats);
        setActiveTrades(mockActiveTrades);
        setWatchlistAlerts(mockWatchlistAlerts);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statItems = [
    {
      title: 'Total PnL',
      value: stats.totalPnL,
      change: '+10.5%',
      changeType: 'increase',
      icon: MonetizationOn,
      color: designTokens.colors.green, // Matches bg-green-500
    },
    {
      title: 'Active Trades',
      value: stats.activeTrades,
      change: '+5.2%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: designTokens.colors.blue, // Matches bg-blue-500
    },
    {
      title: 'Win Rate',
      value: stats.winRate,
      change: '-1.3%',
      changeType: 'decrease',
      icon: Inventory,
      color: designTokens.colors.purple, // Matches bg-purple-500
    },
    {
      title: 'Watchlist Alerts',
      value: stats.watchlistCount,
      change: '+8.7%',
      changeType: 'increase',
      icon: People,
      color: designTokens.colors.orange, // Matches bg-orange-500
    },
  ];

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, color: designTokens.colors.black }}>
      {/* Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: designTokens.colors.gray600, mt: 1 }}>
          Welcome back! Here's an overview of your trading activity.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {statItems.map((stat, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            {loading ? (
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
            ) : (
              <StyledCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', color: designTokens.colors.gray600 }}>
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 'bold', color: designTokens.colors.gray900, mt: 1, fontSize: '1.5rem' }}
                    >
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUp
                        sx={{
                          fontSize: 16,
                          mr: 0.5,
                          color: stat.changeType === 'increase' ? designTokens.colors.green : designTokens.colors.red,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'medium',
                          color: stat.changeType === 'increase' ? designTokens.colors.green : designTokens.colors.red,
                        }}
                      >
                        {stat.change}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.gray500, ml: 0.5, fontSize: '0.75rem' }}>
                        vs last month
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon sx={{ fontSize: 24, color: '#fff' }} />
                  </Box>
                </Box>
              </StyledCard>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Active Trades and Watchlist Alerts */}
      <Grid container spacing={3}>
        {/* Active Trades */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <Typography variant="h6" sx={{ fontWeight: 'medium', color: designTokens.colors.gray900, mb: 3 }}>
              Active Trades
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 3 }} />
            ) : (
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${designTokens.colors.gray200}` }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: designTokens.colors.gray900 }}>Trade ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: designTokens.colors.gray900 }}>Symbol</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: designTokens.colors.gray900 }}>Strategy</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: designTokens.colors.gray900 }}>P&L</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: designTokens.colors.gray900 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeTrades.map((trade, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: designTokens.colors.gray100,
                          '&:hover': { backgroundColor: designTokens.colors.gray200 },
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <TableCell sx={{ color: designTokens.colors.gray900, fontWeight: 'medium' }}>{trade.id}</TableCell>
                        <TableCell sx={{ color: designTokens.colors.gray600 }}>{trade.symbol}</TableCell>
                        <TableCell sx={{ color: designTokens.colors.gray600 }}>{trade.strategy}</TableCell>
                        <TableCell
                          sx={{
                            color: parseFloat(trade.profitLoss.replace('$', '')) >= 0 ? designTokens.colors.green : designTokens.colors.red,
                            fontWeight: 'medium',
                          }}
                        >
                          {trade.profitLoss}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'medium',
                              textAlign: 'center',
                              backgroundColor:
                                trade.status === 'Open'
                                  ? designTokens.colors.blue100
                                  : trade.status === 'Closed'
                                  ? designTokens.colors.green100
                                  : designTokens.colors.gray100,
                              color:
                                trade.status === 'Open'
                                  ? designTokens.colors.blue800
                                  : trade.status === 'Closed'
                                  ? designTokens.colors.green800
                                  : designTokens.colors.gray800,
                            }}
                          >
                            {trade.status}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </StyledCard>
        </Grid>

        {/* Watchlist Alerts */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Warning sx={{ fontSize: 20, color: designTokens.colors.orange, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium', color: designTokens.colors.gray900 }}>
                Watchlist Alerts
              </Typography>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 3 }} />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {watchlistAlerts.map((alert, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      border: `1px solid ${designTokens.colors.orange200}`,
                      backgroundColor: designTokens.colors.orange50,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', color: designTokens.colors.gray900 }}>
                        {alert.symbol}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: designTokens.colors.orange600 }}>
                        ${alert.price} left
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', backgroundColor: designTokens.colors.orange200, borderRadius: '9999px', height: 8 }}>
                      <Box
                        sx={{
                          width: `${(alert.price / alert.threshold) * 100}%`,
                          backgroundColor: designTokens.colors.orange500,
                          height: 8,
                          borderRadius: '9999px',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: designTokens.colors.gray600, mt: 0.5 }}>
                      Alert when price crosses ${alert.threshold}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;