import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import ZonesTable from './table/ZonesTable';
import { fetchDashboardStats, fetchDashboardPnL, fetchDashboardTradeScore, fetchDashboardZones } from '../api/dashboard';

const COLORS = ['#0088FE', '#FF8042'];

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
          fetchDashboardZones()
        ]);
        setStats(statsData);
        setPnL(pnlData);
        setTradeScores(tradeScoreData.scores || []);
        setZones(zonesData.zones || []);
      } catch (err) {
        // Handle error (could add notification)
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Grid container spacing={2} padding={2}>

      {/* Stats Cards */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Today's Demand Zones</Typography>
<Typography variant="h3">{loading ? '-' : stats.todaysDemandZones}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Total Trades</Typography>
<Typography variant="h3">{loading ? '-' : stats.totalTrades}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Win Rate</Typography>
<Typography variant="h3">{loading ? '-' : `${stats.winRate}%`}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* PnL Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">PnL Overview</Typography>
<PieChart width={300} height={200}>
  <Pie data={[
    { name: 'Wins', value: pnl.wins },
    { name: 'Losses', value: pnl.losses }
  ]} cx="50%" cy="50%" outerRadius={70} dataKey="value">
    {['Wins', 'Losses'].map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
          </CardContent>
        </Card>
      </Grid>

      {/* Trade Score Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Trade Score Distribution</Typography>
            <BarChart width={300} height={200} data={tradeScores}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

      {/* Demand Zones Table */}
      <Grid item xs={12}>
        <ZonesTable rows={zones} loading={loading} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
