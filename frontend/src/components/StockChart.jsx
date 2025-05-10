import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div;

const StockChart = ({ data }) => {
  return (
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
      </LineChart>
  );
};

export default StockChart;
