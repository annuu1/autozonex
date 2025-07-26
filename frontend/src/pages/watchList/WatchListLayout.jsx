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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { createAlert, getAlerts } from '../../api/alert';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { styled } from '@mui/material/styles';

// API functions
import {
  getWatchLists,
  addSymbolToWatchList,
  removeSymbolFromWatchList,
  createWatchList,
  deleteWatchList,
  updateWatchList,
} from '../../api/watchList';

const StyledListItem = styled(ListItem)(({ theme, status }) => ({
  transition: 'all 0.3s ease-in-out',
  borderLeft: `4px solid ${
    status === 'Not Sent' ? theme.palette.warning.main : theme.palette.success.main
  }`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.grey[50],
  },
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
}));

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
  const chartLayouts = ['default', 'allTimeframes'];
  const [currentChartLayoutIndex, setCurrentChartLayoutIndex] = useState(0);
  const fullscreenRef = useRef(null);
  const [addAlertDialogOpen, setAddAlertDialogOpen] = useState(false);
  const [alertTicker, setAlertTicker] = useState('');
  const [alertCondition, setAlertCondition] = useState('Above');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertNote, setAlertNote] = useState('');
  const [viewAlertsDialogOpen, setViewAlertsDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertTabValue, setAlertTabValue] = useState(0);
  const { user } = useAuth();
  const { settings } = useSettings();

  // Define selectedWatchList, symbols, and selectedSymbol early
  const selectedWatchList = watchLists[selectedWatchListIdx] || {};
  const symbols = selectedWatchList.symbols || [];
  const selectedSymbol = symbols[selectedSymbolIdx] || null;

  // Fetch watchlists
  const fetchWatchLists = async () => {
    try {
      const data = await getWatchLists();
      setWatchLists(data || []);
    } catch (err) {
      setWatchLists([]);
    }
  };

  // Fetch alerts for selected symbol
  const fetchAlerts = async () => {
    if (!selectedSymbol || !user) return;
    try {
      const response = await getAlerts(user.email);
      const symbolAlerts = response.data.alerts.filter(
        (alert) => alert.ticker.toUpperCase() === selectedSymbol.toUpperCase()
      );
      setAlerts(symbolAlerts);
    } catch (err) {
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchWatchLists();
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [selectedSymbol, user]);

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

  // Add Alert
  const handleAddAlert = () => {
    setAlertTicker(selectedSymbol || '');
    setAlertCondition('Above');
    setAlertPrice('');
    setAlertNote('');
    setAddAlertDialogOpen(true);
  };

  const handleAddAlertSubmit = async () => {
    if (!settings) {
      window.alert('To get alerts on Telegram, you should set your Telegram chat ID in settings');
      return;
    }
    try {
      const alert = await createAlert({
        userEmail: user.email,
        ticker: alertTicker,
        condition: alertCondition,
        alertPrice: parseFloat(alertPrice),
        note: alertNote,
        telegramChatId: settings.telegramChatId,
      });
      if (alert.success) {
        setAddAlertDialogOpen(false);
        fetchAlerts(); // Refresh alerts after adding
      } else {
        window.alert(alert.message);
      }
    } catch (err) {
      window.alert('Failed to create alert.');
    }
  };

  // View Alerts
  const handleViewAlerts = () => {
    setAlertTabValue(0);
    setViewAlertsDialogOpen(true);
  };

  // Toggle fullscreen
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
      if (e.key === 'D' || e.key === 'C') {
        e.preventDefault();
        setCurrentChartLayoutIndex((prevIndex) => (prevIndex + 1) % chartLayouts.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chartLayouts.length]);

  const unsentAlertsCount = alerts.filter(
    (alert) => alert.triggerNotificationStatus === 'Not Sent'
  ).length;

  const sentAlerts = alerts.filter((alert) => alert.triggerNotificationStatus !== 'Not Sent');
  const unsentAlerts = alerts.filter((alert) => alert.triggerNotificationStatus === 'Not Sent');

  const calculatePercentDiff = (alertPrice, dayLow) => {
    if (!dayLow || !alertPrice) return null;
    const diff = ((dayLow - alertPrice) / alertPrice) * 100;
    return diff.toFixed(2);
  };

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
          sx={{ textTransform: 'none', borderRadius: 20 }}
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
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
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
          </Box>
        </Paper>
        {/* Symbol Details */}
        <Box className="flex-1 p-4 overflow-y-auto">
          {selectedSymbol ? (
            <Box
              ref={fullscreenRef}
              className={`relative w-full ${
                isFullscreen
                  ? 'fixed inset-0 bg-white z-50 p-6 overflow-auto'
                  : 'w-full'
              }`}
            >
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h5">{selectedSymbol} ({
                  chartLayouts[currentChartLayoutIndex] === 'allTimeframes' ? '60m, 5m, 15m' : '1d, 1wk, 1mo'
                })</Typography>
                <Box className="flex gap-2">
                  <Button
                    variant="contained"
                    startIcon={<NotificationsActiveIcon sx={{ fontSize: 12 }} />}
                    onClick={handleAddAlert}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: 20,
                      padding: '0px 16px',
                      minWidth: 'auto',
                      lineHeight: 1.2,
                    }}
                    disabled={!selectedSymbol}
                  >
                    Add Alert
                  </Button>
                  <Badge
                    badgeContent={unsentAlertsCount}
                    color="warning"
                    sx={{
                      '& .MuiBadge-badge': {
                        top: -8,
                        right: -8,
                        fontSize: '0.65rem',
                        height: 16,
                        minWidth: 16,
                        padding: '0 4px',
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<NotificationsActiveIcon sx={{ fontSize: 12 }} />}
                      onClick={handleViewAlerts}
                      size="small"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 20,
                        padding: '0px 16px',
                        minWidth: 'auto',
                        lineHeight: 1.2,
                      }}
                      disabled={!selectedSymbol}
                    >
                      View Alerts
                    </Button>
                  </Badge>
                  <IconButton onClick={toggleFullscreen}>
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Box>
              </Box>
              <Divider className="mb-4" />
              <Box className="flex flex-col gap-4">
                {chartLayouts[currentChartLayoutIndex] === 'default' && (
                  <>
                    <Box className="w-full">
                      <StockChart ticker={selectedSymbol} timeFrame="1d" />
                    </Box>
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <StockChart ticker={selectedSymbol} timeFrame="1wk" />
                      <StockChart ticker={selectedSymbol} timeFrame="1mo" />
                    </Box>
                  </>
                )}
                {chartLayouts[currentChartLayoutIndex] === 'allTimeframes' && (
                  <>
                    <Box className="w-full">
                      <StockChart ticker={selectedSymbol} timeFrame="60m" />
                    </Box>
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <StockChart ticker={selectedSymbol} timeFrame="5m" />
                      <StockChart ticker={selectedSymbol} timeFrame="15m" />
                    </Box>
                  </>
                )}
              </Box>
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

      {/* Add Alert Dialog */}
      <Dialog open={addAlertDialogOpen} onClose={() => setAddAlertDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Add Alert
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3 pt-6">
          <TextField
            label="Stock"
            value={alertTicker}
            onChange={(e) => setAlertTicker(e.target.value.toUpperCase())}
            fullWidth
            autoFocus
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={alertCondition}
              label="Condition"
              onChange={(e) => setAlertCondition(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="Above">Above</MenuItem>
              <MenuItem value="Below">Below</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Alert Price"
            type="number"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Note"
            value={alertNote}
            onChange={(e) => setAlertNote(e.target.value)}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddAlertDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAlertSubmit}
            variant="contained"
            disabled={!alertTicker || !alertPrice}
            sx={{ textTransform: 'none', borderRadius: 20 }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Alerts Dialog */}
      <Dialog open={viewAlertsDialogOpen} onClose={() => setViewAlertsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Alerts for {selectedSymbol}
        </DialogTitle>
        <DialogContent className="pt-4">
          <Tabs
            value={alertTabValue}
            onChange={(e, newValue) => setAlertTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Unsent" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label="Sent" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
          <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {(alertTabValue === 0 ? unsentAlerts : sentAlerts).length === 0 ? (
              <Typography className="text-center text-gray-500 py-8">
                No {alertTabValue === 0 ? 'unsent' : 'sent'} alerts for {selectedSymbol}.
              </Typography>
            ) : (
              (alertTabValue === 0 ? unsentAlerts : sentAlerts).map((alert) => (
                <StyledListItem
                  key={alert.id}
                  status={alert.triggerNotificationStatus}
                >
                  <ListItemText
                    primary={
                      <Box className="flex items-center gap-2">
                        <Typography variant="subtitle1" className="font-semibold">
                          {alert.ticker}
                        </Typography>
                        <Chip
                          label={alert.condition}
                          size="small"
                          color={alert.condition === 'Above' ? 'success' : 'error'}
                          sx={{ fontWeight: 500 }}
                        />
                        <Typography variant="subtitle1" className="font-semibold">
                          {alert.alertPrice}
                        </Typography>
                        {alert.dayLow && (
                          <Typography variant="body2" color="textSecondary">
                            Day Low: {alert.dayLow}
                          </Typography>
                        )}
                        {alert.dayLow && calculatePercentDiff(alert.alertPrice, alert.dayLow) && (
                          <Chip
                            label={`${calculatePercentDiff(alert.alertPrice, alert.dayLow)}%`}
                            size="small"
                            color={
                              Math.abs(calculatePercentDiff(alert.alertPrice, alert.dayLow)) < 5
                                ? 'warning'
                                : 'default'
                            }
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      alert.note && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          {alert.note}
                        </Typography>
                      )
                    }
                  />
                </StyledListItem>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setViewAlertsDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WatchListLayout;