import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled, Card, CardContent, IconButton, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, ShoppingCart, Inventory, People, MonetizationOn, Warning, Visibility, MoreVert, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { designTokens } from '../utils/designTokens';
import { fetchDashboardStats, fetchDashboardTradeScore, fetchDashboardZones } from '../api/dashboard';

// Enhanced StyledCard with better shadows and animations
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius * 3,
  border: `1px solid ${designTokens.colors.gray200}`,
  padding: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

// Animated metric card with gradient backgrounds
const MetricCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
  border: `1px solid ${color}20`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2.5),
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${color}25`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '100px',
    height: '100px',
    background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
    borderRadius: '50%',
  },
}));

// Enhanced table with better styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${designTokens.colors.gray200}`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: designTokens.colors.gray700,
    borderBottom: `2px solid ${designTokens.colors.gray200}`,
  },
  '& .MuiTableRow-root': {
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: designTokens.colors.gray100,
    },
  },
}));

// Progress bar component
const ProgressBar = ({ value, max, color }) => (
  <Box sx={{ width: '100%', backgroundColor: `${color}20`, borderRadius: '8px', height: 8, overflow: 'hidden' }}>
    <Box
      sx={{
        width: `${(value / max) * 100}%`,
        backgroundColor: color,
        height: '100%',
        borderRadius: '8px',
        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
      }}
    />
  </Box>
);

// Hardcoded data structured for API integration
const mockStats = {
  totalPnL: '$12,345.67',
  activeTrades: 23,
  winRate: '65.2%',
  watchlistCount: 15,
};

const mockActiveTrades = [
  { id: '#T12345', symbol: 'AAPL', strategy: 'Breakout', profitLoss: '$245.50', status: 'Open', change: '+2.4%' },
  { id: '#T12344', symbol: 'TSLA', strategy: 'Swing', profitLoss: '-$150.75', status: 'Open', change: '-1.8%' },
  { id: '#T12343', symbol: 'MSFT', strategy: 'Momentum', profitLoss: '$320.00', status: 'Closed', change: '+4.2%' },
  { id: '#T12342', symbol: 'NVDA', strategy: 'Scalping', profitLoss: '$89.25', status: 'Open', change: '+1.1%' },
];

const mockWatchlistAlerts = [
  { symbol: 'GOOGL', price: 175.25, threshold: 180.00, progress: 97.4 },
  { symbol: 'AMZN', price: 185.50, threshold: 190.00, progress: 97.6 },
  { symbol: 'SPY', price: 425.30, threshold: 430.00, progress: 98.9 },
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
      color: designTokens.colors.green,
      description: 'vs last month',
    },
    {
      title: 'Active Trades',
      value: stats.activeTrades,
      change: '+5.2%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: designTokens.colors.blue,
      description: 'currently open',
    },
    {
      title: 'Win Rate',
      value: stats.winRate,
      change: '-1.3%',
      changeType: 'decrease',
      icon: Inventory,
      color: designTokens.colors.purple,
      description: 'success ratio',
    },
    {
      title: 'Watchlist Alerts',
      value: stats.watchlistCount,
      change: '+8.7%',
      changeType: 'increase',
      icon: People,
      color: designTokens.colors.orange,
      description: 'active alerts',
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: designTokens.colors.gray900, mb: 1 }}>
          Trading Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: designTokens.colors.gray600 }}>
          Welcome back! Here's an overview of your trading performance and market activity.
        </Typography>
      </Box>

      {/* Enhanced Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statItems.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            {loading ? (
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
            ) : (
              <MetricCard color={stat.color}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: designTokens.colors.gray600, mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: designTokens.colors.gray900, fontSize: '2rem', lineHeight: 1.2 }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '12px',
                        backgroundColor: `${stat.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <stat.icon sx={{ fontSize: 24, color: stat.color }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={stat.changeType === 'increase' ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                      label={stat.change}
                      size="small"
                      sx={{
                        backgroundColor: stat.changeType === 'increase' ? `${designTokens.colors.green}15` : `${designTokens.colors.red}15`,
                        color: stat.changeType === 'increase' ? designTokens.colors.green : designTokens.colors.red,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: designTokens.colors.gray500 }}>
                      {stat.description}
                    </Typography>
                  </Box>
                </CardContent>
              </MetricCard>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Content Grid */}
      <Grid container spacing={3}>
        {/* Active Trades */}
        <Grid item xs={12} lg={8}>
          <StyledCard>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: designTokens.colors.gray900 }}>
                Active Trades
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            ) : (
              <StyledTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Trade ID</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Strategy</TableCell>
                      <TableCell>Change</TableCell>
                      <TableCell>P&L</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeTrades.map((trade, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: 500, color: designTokens.colors.gray900 }}>
                          {trade.id}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {trade.symbol}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: designTokens.colors.gray600 }}>{trade.strategy}</TableCell>
                        <TableCell>
                          <Chip
                            label={trade.change}
                            size="small"
                            sx={{
                              backgroundColor: trade.change.startsWith('+') ? `${designTokens.colors.green}15` : `${designTokens.colors.red}15`,
                              color: trade.change.startsWith('+') ? designTokens.colors.green : designTokens.colors.red,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            color: parseFloat(trade.profitLoss.replace('$', '')) >= 0 ? designTokens.colors.green : designTokens.colors.red,
                            fontWeight: 600,
                          }}
                        >
                          {trade.profitLoss}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={trade.status}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor:
                                trade.status === 'Open'
                                  ? designTokens.colors.blue
                                  : trade.status === 'Closed'
                                  ? designTokens.colors.green
                                  : designTokens.colors.gray400,
                              color:
                                trade.status === 'Open'
                                  ? designTokens.colors.blue
                                  : trade.status === 'Closed'
                                  ? designTokens.colors.green
                                  : designTokens.colors.gray600,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </StyledCard>
        </Grid>

        {/* Watchlist Alerts */}
        <Grid item xs={12} lg={4}>
          <StyledCard>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Warning sx={{ fontSize: 20, color: designTokens.colors.orange, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: designTokens.colors.gray900 }}>
                Price Alerts
              </Typography>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {watchlistAlerts.map((alert, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: `1px solid ${designTokens.colors.orange}30`,
                      backgroundColor: `${designTokens.colors.orange}08`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: `${designTokens.colors.orange}15`,
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: designTokens.colors.gray900 }}>
                        {alert.symbol}
                      </Typography>
                      <Chip
                        label={`${alert.progress.toFixed(1)}%`}
                        size="small"
                        sx={{
                          backgroundColor: designTokens.colors.orange,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.gray600 }}>
                          Current: ${alert.price}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.gray600 }}>
                          Target: ${alert.threshold}
                        </Typography>
                      </Box>
                      <ProgressBar
                        value={alert.price}
                        max={alert.threshold}
                        color={designTokens.colors.orange}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: designTokens.colors.gray500 }}>
                      ${(alert.threshold - alert.price).toFixed(2)} away from target
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