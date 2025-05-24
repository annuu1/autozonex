import React, { useState, useEffect, useRef } from 'react';
import StockChart from '../../components/StockChart';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// API functions
import {
  getWatchLists,
  addSymbolToWatchList,
  removeSymbolFromWatchList,
  createWatchList,
  deleteWatchList,
  updateWatchList,
} from '../../api/watchList';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const WatchListLayout = () => {
  const [watchLists, setWatchLists] = useState([]);
  const [selectedWatchListIdx, setSelectedWatchListIdx] = useState(0);
  const [selectedSymbolIdx, setSelectedSymbolIdx] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newWatchListName, setNewWatchListName] = useState('');
  const [newWatchListSymbols, setNewWatchListSymbols] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editWatchList, setEditWatchList] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSymbols, setEditSymbols] = useState('');
  const [symbolInput, setSymbolInput] = useState('');
  const [symbolAddError, setSymbolAddError] = useState('');

  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);

  // Fetch watchlists
  const fetchWatchLists = async () => {
    try {
      const data = await getWatchLists();
      setWatchLists(data || []);
    } catch (err) {
      setWatchLists([]);
    }
  };

  useEffect(() => {
    fetchWatchLists();
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

  // Add Watchlist
  const handleAddWatchList = async () => {
    if (!newWatchListName.trim()) return;
    const symbols = newWatchListSymbols
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    try {
      await createWatchList({ name: newWatchListName.trim(), symbols });
      setAddDialogOpen(false);
      setNewWatchListName('');
      setNewWatchListSymbols('');
      fetchWatchLists();
    } catch (err) {
      // Optionally handle error
    }
  };

  // Edit Watchlist
  const handleEditWatchList = async () => {
    if (!editName.trim()) return;
    const symbols = editSymbols
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    try {
      await updateWatchList(editWatchList._id || editWatchList.id, {
        name: editName.trim(),
        symbols,
      });
      setEditDialogOpen(false);
      setEditWatchList(null);
      fetchWatchLists();
    } catch (err) {
      // Optionally handle error
    }
  };

  // Add Symbol
  const handleAddSymbol = async (e) => {
    e.preventDefault();
    setSymbolAddError('');
    const symbol = symbolInput.trim().toUpperCase();
    if (!symbol) return;
    const selectedWatchList = watchLists[selectedWatchListIdx];
    if (selectedWatchList.symbols.includes(symbol)) {
      setSymbolAddError('Symbol already exists in this watchlist.');
      return;
    }
    try {
      await addSymbolToWatchList(
        selectedWatchList._id || selectedWatchList.id,
        symbol
      );
      setSymbolInput('');
      fetchWatchLists();
    } catch (err) {
      setSymbolAddError('Failed to add symbol.');
    }
  };

  const selectedWatchList = watchLists[selectedWatchListIdx] || {};
  const symbols = selectedWatchList.symbols || [];
  const selectedSymbol = symbols[selectedSymbolIdx] || null;

  //toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === 'f') || e.key === 'F' || e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box className="flex flex-col h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-200 bg-white">
      {/* Tabs for Watchlists */}
      <Paper
        elevation={0}
        className="border-b border-gray-200 bg-gray-50 flex items-center justify-between px-4"
      >
        <Tabs
          value={selectedWatchListIdx}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {watchLists.length > 0 ? (
            watchLists.map((wl, idx) => (
              <Tab
                key={wl.id || wl._id || idx}
                label={
                  <Box className="flex items-center">
                    {wl.name}
                    <Box className="ml-2">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditWatchList(wl);
                          setEditName(wl.name);
                          setEditSymbols(wl.symbols.join(','));
                          setEditDialogOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this watchlist?')) {
                            await deleteWatchList(wl._id || wl.id);
                            setSelectedWatchListIdx(0);
                            fetchWatchLists();
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                }
              />
            ))
          ) : (
            <Tab label="No Watchlists" disabled />
          )}
        </Tabs>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          size="small"
        >
          New
        </Button>
      </Paper>
      <Box className="flex flex-1 min-h-0">
        {/* Symbols List */}
        <Paper
          elevation={0}
          className="w-64 border-r border-gray-200 bg-gray-50"
          square
        >
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-100 flex items-center justify-between">
            <Typography variant="h6" className="!font-semibold !text-base">
              Symbols
            </Typography>
            {watchLists.length > 0 && (
              <form
                onSubmit={handleAddSymbol}
                className="flex items-center gap-2"
              >
                <TextField
                  size="small"
                  label="Add Symbol"
                  value={symbolInput}
                  onChange={(e) => setSymbolInput(e.target.value)}
                  variant="outlined"
                  sx={{ minWidth: 120 }}
                />
                <IconButton type="submit">
                  <AddIcon fontSize="small" />
                </IconButton>
              </form>
            )}
          </div>
          {symbolAddError && (
            <Typography color="error" variant="body2" className="px-4 py-1">
              {symbolAddError}
            </Typography>
          )}
          <List disablePadding>
            {symbols.length > 0 ? (
              symbols.map((symbol, idx) => (
                <ListItem
                  key={symbol}
                  disablePadding
                  className="!block"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={async () => {
                        await removeSymbolFromWatchList(
                          selectedWatchList._id || selectedWatchList.id,
                          symbol
                        );
                        fetchWatchLists();
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    selected={idx === selectedSymbolIdx}
                    onClick={() => handleSymbolSelect(idx)}
                    className={`!rounded-none !pl-6 !pr-4 !py-2
                      ${
                        idx === selectedSymbolIdx
                          ? 'bg-blue-100 font-semibold text-blue-900 border-l-4 border-blue-600'
                          : 'border-l-4 border-transparent'
                      }
                    `}
                  >
                    <ListItemText
                      primary={symbol}
                      primaryTypographyProps={{
                        className:
                          idx === selectedSymbolIdx ? 'font-semibold' : '',
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
            <Box
            ref={fullscreenRef}
            className={`relative ${
              isFullscreen
                ? 'fixed inset-0 bg-white z-50 p-6 overflow-auto'
                : 'max-w-6xl mx-auto w-full'
            }`}
          >
            <Box className="flex justify-between items-center">
              <Typography variant="h5">{selectedSymbol}</Typography>
              <IconButton onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
            <Divider className="mb-4" />
            <div>
              <div>
                <StockChart ticker={selectedSymbol} />
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <StockChart ticker={selectedSymbol} timeFrame="1wk" />
                <StockChart ticker={selectedSymbol} timeFrame="1mo" />
              </div>
            </div>
          </Box>
          
          ) : (
            <Typography className="text-gray-400">
              Select a symbol to see details
            </Typography>
          )}
        </Box>
      </Box>

      {/* Add Watchlist Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Watchlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Watchlist Name"
            fullWidth
            value={newWatchListName}
            onChange={(e) => setNewWatchListName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Symbols (comma separated)"
            fullWidth
            value={newWatchListSymbols}
            onChange={(e) => setNewWatchListSymbols(e.target.value)}
            helperText="Example: AAPL, TSLA, MSFT"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddWatchList} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Watchlist Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Watchlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Watchlist Name"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Symbols (comma separated)"
            fullWidth
            value={editSymbols}
            onChange={(e) => setEditSymbols(e.target.value)}
            helperText="Example: AAPL, TSLA, MSFT"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditWatchList} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WatchListLayout;
