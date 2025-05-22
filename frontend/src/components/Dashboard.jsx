import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import ZonesTable from './table/ZonesTable';

const data = [
  { name: 'Wins', value: 24 },
  { name: 'Losses', value: 6 },
];
const COLORS = ['#0088FE', '#FF8042'];

const Dashboard = () => {
  return (
    <Grid container spacing={2} padding={2}>
      {/* Stats Cards */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Today's Demand Zones</Typography>
            <Typography variant="h3">18</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Total Trades</Typography>
            <Typography variant="h3">45</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Win Rate</Typography>
            <Typography variant="h3">80%</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* PnL Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">PnL Overview</Typography>
            <PieChart width={300} height={200}>
              <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                {data.map((entry, index) => (
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
            <BarChart width={300} height={200} data={[
              { name: 'Score 4', count: 10 },
              { name: 'Score 5', count: 8 },
              { name: 'Score 6+', count: 4 },
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

      {/* Demand Zones Table */}
      <Grid item xs={12}>
        <ZonesTable />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
