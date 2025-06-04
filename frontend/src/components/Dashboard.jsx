import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Skeleton, Divider, styled } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { AnimatedBackground, GlassCard } from '../components/StyledComponents';
import { designTokens } from '../utils/designTokens';
import ZonesTable from './table/ZonesTable';
import { fetchDashboardStats, fetchDashboardPnL, fetchDashboardTradeScore, fetchDashboardZones } from '../api/dashboard';

// Custom card with subtle gradient and hover effect
const StyledCard = styled(Box)(({ theme }) => ({
  background: `linear-gradient(145deg, ${designTokens.colors.glassBg}, rgba(255, 255, 255, 0.05))`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${designTokens.colors.glassBorder}`,
  padding: theme.spacing(2),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px rgba(31, 38, 135, 0.2)`,
  },
}));

const COLORS = [designTokens.colors.teal, designTokens.colors.error];

const Dashboard = () => {
  const [stats, setStats] = useState({ todaysDemandZones: 0, totalTrades: 0, winRate: 0 });
  const [pnl, setPnL] = useState({ wins: 0, losses: 0 });
  const [tradeScores, setTradeScores] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsData, pnlData, tradeScoreData, zonesData] = await Promise.all([
          fetchDashboardStats(),
          fetchDashboardPnL(),
          fetchDashboardTradeScore(),
          fetchDashboardZones(),
        ]);
        setStats(statsData);
        setPnL(pnlData);
        setTradeScores(tradeScoreData.scores || []);
        setZones(zonesData.zones || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AnimatedBackground>
      <GlassCard sx={{ maxWidth: 1200, p: 4 }}>
        <Typography variant="h4" sx={{ color: designTokens.colors.white, mb: 4, fontWeight: 'bold' }}>
          Trading Dashboard
        </Typography>

        {/* Stats Section */}
        <Typography variant="h6" sx={{ color: designTokens.colors.lightGray, mb: 2 }}>
          Key Metrics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: "Today's Demand Zones", value: stats.todaysDemandZones },
            { title: 'Total Trades', value: stats.totalTrades },
            { title: 'Win Rate', value: `${stats.winRate}%` },
          ].map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <StyledCard>
                <Typography variant="body1" sx={{ color: designTokens.colors.lightGray, mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ color: designTokens.colors.white }}>
                  {loading ? <Skeleton width={60} /> : stat.value}
                </Typography>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ borderColor: designTokens.colors.inputBorder, mb: 4 }} />

        {/* Charts Section */}
        <Typography variant="h6" sx={{ color: designTokens.colors.lightGray, mb: 2 }}>
          Performance Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* PnL Pie Chart */}
          <Grid item xs={12} sm={6}>
            <StyledCard>
              <Typography variant="body1" sx={{ color: designTokens.colors.lightGray, mb: 2 }}>
                PnL Overview
              </Typography>
              {loading ? (
                <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={[
                        { name: 'Wins', value: pnl.wins },
                        { name: 'Losses', value: pnl.losses },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {['Wins', 'Losses'].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: designTokens.colors.glassBg,
                        border: `1px solid ${designTokens.colors.glassBorder}`,
                        color: designTokens.colors.white,
                        borderRadius: 8,
                      }}
                    />
                  </PieChart>
                </Box>
              )}
            </StyledCard>
          </Grid>

          {/* Trade Score Bar Chart */}
          <Grid item xs={12} sm={6}>
            <StyledCard>
              <Typography variant="body1" sx={{ color: designTokens.colors.lightGray, mb: 2 }}>
                Trade Score Distribution
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" width={300} height={200} sx={{ mx: 'auto' }} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <BarChart width={300} height={200} data={tradeScores}>
                    <XAxis dataKey="name" stroke={designTokens.colors.lightGray} />
                    <YAxis stroke={designTokens.colors.lightGray} />
                    <Tooltip
                      contentStyle={{
                        background: designTokens.colors.glassBg,
                        border: `1px solid ${designTokens.colors.glassBorder}`,
                        color: designTokens.colors.white,
                        borderRadius: 8,
                      }}
                    />
                    <Bar dataKey="score" fill={designTokens.colors.teal} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </Box>
              )}
            </StyledCard>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: designTokens.colors.inputBorder, mb: 4 }} />

        {/* Demand Zones Table Section */}
        <Typography variant="h6" sx={{ color: designTokens.colors.lightGray, mb: 2 }}>
          Demand Zones
        </Typography>
        <StyledCard sx={{ p: 0 }}>
          <ZonesTable rows={zones} loading={loading} />
        </StyledCard>
      </GlassCard>
    </AnimatedBackground>
  );
};

export default Dashboard;