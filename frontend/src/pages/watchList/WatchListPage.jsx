import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Paper, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';

// Dummy API functions (replace with real API calls)
import {
  getWatchLists,
} from '../../api/watchList';

// You may want to fetch symbol details from an API
// For now, just show the symbol name in the details

const WatchListLayout = () => {
  const [watchLists, setWatchLists] = useState([]);
  const [selectedWatchListIdx, setSelectedWatchListIdx] = useState(0);
  const [selectedSymbolIdx, setSelectedSymbolIdx] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getWatchLists();
        setWatchLists(data || []);
      } catch (err) {
        setWatchLists([]);
      }
    };
    fetch();
  }, []);

  // Reset symbol selection when watchlist changes
  useEffect(() => {
    setSelectedSymbolIdx(0);
  }, [selectedWatchListIdx]);

  const handleTabChange = (event, newValue) => {
    setSelectedWatchListIdx(newValue);
  };

  const handleSymbolSelect = (idx) => {
    setSelectedSymbolIdx(idx);
  };

  const selectedWatchList = watchLists[selectedWatchListIdx] || {};
  const symbols = selectedWatchList.symbols || [];
  const selectedSymbol = symbols[selectedSymbolIdx] || null;

  return (
    <Box className="flex flex-col h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-200 bg-white">
      {/* Tabs for Watchlists */}
      <Paper elevation={0} className="border-b border-gray-200 bg-gray-50">
        <Tabs
          value={selectedWatchListIdx}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {watchLists.length > 0 ? (
            watchLists.map((wl, idx) => (
              <Tab key={wl.id || wl._id || idx} label={wl.name} />
            ))
          ) : (
            <Tab label="No Watchlists" disabled />
          )}
        </Tabs>
      </Paper>
      <Box className="flex flex-1 min-h-0">
        {/* Symbols List */}
        <Paper
          elevation={0}
          className="w-64 border-r border-gray-200 bg-gray-50"
          square
        >
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-100">
            <Typography variant="h6" className="!font-semibold !text-base">
              Symbols
            </Typography>
          </div>
          <List disablePadding>
            {symbols.length > 0 ? (
              symbols.map((symbol, idx) => (
                <ListItem
                  key={symbol}
                  disablePadding
                  className="!block"
                >
                  <ListItemButton
                    selected={idx === selectedSymbolIdx}
                    onClick={() => handleSymbolSelect(idx)}
                    className={`!rounded-none !pl-6 !pr-4 !py-2
                      ${idx === selectedSymbolIdx
                        ? 'bg-blue-100 font-semibold text-blue-900 border-l-4 border-blue-600'
                        : 'border-l-4 border-transparent'}
                    `}
                  >
                    <ListItemText
                      primary={symbol}
                      primaryTypographyProps={{
                        className: idx === selectedSymbolIdx ? 'font-semibold' : ''
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem className="!pl-6 !py-4 text-gray-400">
                <ListItemText primary="No symbols" />
              </ListItem>
            )}
          </List>
        </Paper>
        {/* Symbol Details */}
        <Box className="flex-1 p-6 overflow-y-auto">
          {selectedSymbol ? (
            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedSymbol}
              </Typography>
              <Divider className="mb-4" />
              {/* Replace below with actual symbol details */}
              <Typography variant="body1">
                Details for <b>{selectedSymbol}</b> will appear here.
              </Typography>
            </Box>
          ) : (
            <Typography className="text-gray-400">Select a symbol to see details</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WatchListLayout;
