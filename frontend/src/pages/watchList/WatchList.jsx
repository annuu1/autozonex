import React, { useEffect, useState } from 'react';
import {
  getWatchLists,
  addSymbolToWatchList,
  removeSymbolFromWatchList,
  createWatchList,
  deleteWatchList,
  updateWatchList,
} from '../../api/watchList';
import ItemDetailsLayout from '../../components/layouts/ItemDetailsLayout';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const WatchList = () => {
  const [watchLists, setWatchLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newWatchListName, setNewWatchListName] = useState('');
  const [newWatchListSymbols, setNewWatchListSymbols] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editWatchList, setEditWatchList] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSymbols, setEditSymbols] = useState('');
  const [symbolInput, setSymbolInput] = useState('');
  const [symbolAddError, setSymbolAddError] = useState('');

  // Fetch all watchlists
  const fetchWatchLists = async () => {
    setLoading(true);
    try {
      const data = await getWatchLists();
      setWatchLists(data);
    } catch (err) {
      // Optionally handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWatchLists();
  }, []);

  // Render each watchlist in the left panel
  const renderWatchListItem = (item) => (
    <Box className="flex items-center justify-between">
      <span>{item.name}</span>
      <Box>
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation();
            setEditWatchList(item);
            setEditName(item.name);
            setEditSymbols(item.symbols.join(','));
            setEditDialogOpen(true);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={async e => {
            e.stopPropagation();
            if (window.confirm('Delete this watchlist?')) {
              await deleteWatchList(item._id || item.id);
              fetchWatchLists();
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  // Render the details (symbols) of the selected watchlist
  const renderWatchListDetails = (watchList) => {
    if (!watchList) return null;
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          {watchList.name}
        </Typography>
        <Box className="mb-4">
          <form
            onSubmit={async e => {
              e.preventDefault();
              setSymbolAddError('');
              const symbol = symbolInput.trim().toUpperCase();
              if (!symbol) return;
              if (watchList.symbols.includes(symbol)) {
                setSymbolAddError('Symbol already exists in this watchlist.');
                return;
              }
              try {
                await addSymbolToWatchList(watchList._id || watchList.id, symbol);
                setSymbolInput('');
                fetchWatchLists();
              } catch (err) {
                setSymbolAddError('Failed to add symbol.');
              }
            }}
            className="flex items-center gap-2"
          >
            <TextField
              size="small"
              label="Add Symbol"
              value={symbolInput}
              onChange={e => setSymbolInput(e.target.value)}
              variant="outlined"
              sx={{ minWidth: 120 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </form>
          {symbolAddError && (
            <Typography color="error" variant="body2" className="mt-1">
              {symbolAddError}
            </Typography>
          )}
        </Box>
        <Divider />
        <List>
          {watchList.symbols && watchList.symbols.length > 0 ? (
            watchList.symbols.map((symbol, idx) => (
              <ListItem
                key={symbol}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={async () => {
                      await removeSymbolFromWatchList(watchList._id || watchList.id, symbol);
                      fetchWatchLists();
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={symbol}
                  secondary={null}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No symbols in this watchlist." />
            </ListItem>
          )}
        </List>
      </Box>
    );
  };

  // Add Watchlist Dialog
  const handleAddWatchList = async () => {
    if (!newWatchListName.trim()) return;
    const symbols = newWatchListSymbols
      .split(',')
      .map(s => s.trim().toUpperCase())
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

  // Edit Watchlist Dialog
  const handleEditWatchList = async () => {
    if (!editName.trim()) return;
    const symbols = editSymbols
      .split(',')
      .map(s => s.trim().toUpperCase())
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

  return (
    <Box className="p-6">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h5" className="font-semibold">
          Watchlists
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          New Watchlist
        </Button>
      </Box>
      <ItemDetailsLayout
        items={watchLists}
        renderItem={renderWatchListItem}
        renderDetails={renderWatchListDetails}
        listHeader="Your Watchlists"
      />

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
            onChange={e => setNewWatchListName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Symbols (comma separated)"
            fullWidth
            value={newWatchListSymbols}
            onChange={e => setNewWatchListSymbols(e.target.value)}
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
            onChange={e => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Symbols (comma separated)"
            fullWidth
            value={editSymbols}
            onChange={e => setEditSymbols(e.target.value)}
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

export default WatchList;
