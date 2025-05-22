import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 100 },
  { field: 'proximalLine', headerName: 'Proximal', width: 120 },
  { field: 'distalLine', headerName: 'Distal', width: 120 },
  { field: 'timeFrame', headerName: 'Timeframe', width: 100 },
  { field: 'legOutDate', headerName: 'Leg Out Date', width: 160 },
];

const rows = [
  { id: 1, ticker: 'NIFTY', proximalLine: 19850, distalLine: 19760, timeFrame: '1d', legOutDate: '2024-05-21' },
  { id: 2, ticker: 'RELIANCE', proximalLine: 2560, distalLine: 2520, timeFrame: '1d', legOutDate: '2024-05-21' },
];

const ZonesTable = () => {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

export default ZonesTable;
