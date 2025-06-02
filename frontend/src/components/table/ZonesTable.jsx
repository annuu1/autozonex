import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 100 },
  { field: 'proximalLine', headerName: 'Proximal', width: 120 },
  { field: 'distalLine', headerName: 'Distal', width: 120 },
  { field: 'timeFrame', headerName: 'Timeframe', width: 100 },
  { field: 'legOutDate', headerName: 'Leg Out Date', width: 160 },
];

import CircularProgress from '@mui/material/CircularProgress';

const ZonesTable = ({ rows = [], loading = false }) => {
  return (
    <div style={{ height: 300, width: '100%', position: 'relative' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} loading={loading} />
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default ZonesTable;
