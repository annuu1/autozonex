import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { createAlert, getAlerts } from "../../api/alert";
import {useAuth} from "../../hooks/useAuth"

// Dummy data and functions for demonstration
const dummyAlerts = [
  {
    id: 1,
    ticker: "AAPL",
    condition: "Above",
    alertPrice: 180,
    note: "Breakout watch",
  },
  {
    id: 2,
    ticker: "TSLA",
    condition: "Below",
    alertPrice: 600,
    note: "",
  },
];

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Form state
  const [ticker, setTicker] = useState("");
  const [condition, setCondition] = useState("Above");
  const [alertPrice, setAlertPrice] = useState("");
  const [note, setNote] = useState("");
  const {user} = useAuth(); 

  useEffect(() => {
    // Replace with API call
    const fetchAlerts = async ()=>{
        const alerts = await getAlerts(user.email)
        setAlerts(alerts.data.alerts)
    }
    fetchAlerts()
    // setAlerts(dummyAlerts);
  }, []);

  const handleAdd = () => {
    setTicker("");
    setCondition("Below");
    setAlertPrice("");
    setNote("");
    setAddDialogOpen(true);
  };

  const handleEdit = (alert) => {
    setSelectedAlert(alert);
    setTicker(alert.ticker);
    setCondition(alert.condition);
    setAlertPrice(alert.alertPrice);
    setNote(alert.note || "");
    setEditDialogOpen(true);
  };

  const handleDelete = (alert) => {
    setSelectedAlert(alert);
    setDeleteDialogOpen(true);
  };

  const handleAddSubmit = () => {
    // Replace with API call
    const addAlert = async()=>{
        const alert = await createAlert({userEmail : user.email, ticker, condition,alertPrice: parseFloat(alertPrice), note});
        if(alert.success){
          setAlerts([
            ...alerts,
            {
              id: Date.now(),
              ticker,
              condition,
              alertPrice: parseFloat(alertPrice),
              note,
            },
          ]);
          setAddDialogOpen(false);
        }else{
          window.alert(alert.message)
        }
    }
    addAlert();
  };

  const handleEditSubmit = () => {
    // Replace with API call
    setAlerts(
      alerts.map((a) =>
        a.id === selectedAlert.id
          ? { ...a, ticker, condition, alertAlertPrice: parseFloat(alertPrice), note }
          : a
      )
    );
    setEditDialogOpen(false);
    setSelectedAlert(null);
  };

  const handleDeleteConfirm = () => {
    // Replace with API call
    setAlerts(alerts.filter((a) => a.id !== selectedAlert.id));
    setDeleteDialogOpen(false);
    setSelectedAlert(null);
  };

  return (
    <Box className="flex flex-col items-center w-full min-h-screen bg-gray-50 py-8">
      <Paper className="w-full max-w-2xl p-6 shadow-md">
        <Box className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-bold flex items-center gap-2">
            <NotificationsActiveIcon color="primary" />
            Alerts
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            size="small"
          >
            New Alert
          </Button>
        </Box>
        <List>
          {alerts.length === 0 ? (
            <Typography className="text-center text-gray-500 py-8">
              No alerts set.
            </Typography>
          ) : (
            alerts.map((alert) => (
              <ListItem
                key={alert.id}
                className="rounded-lg mb-2 bg-white shadow-sm border border-gray-100"
                sx={{ "&:hover": { backgroundColor: "#f3f4f6" } }}
              >
                <ListItemText
                  primary={
                    <span className="font-semibold">
                      {alert.ticker} {alert.condition} {alert.alertAlertPrice}
                    </span> 
                  }
                  secondary={alert.note && <span className="text-gray-500">{alert.note}</span>}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(alert)}
                    className="mr-2"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(alert)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      {/* Add Alert Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Alert</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2">
          <TextField
            label="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            fullWidth
            autoFocus
          />
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={condition}
              label="Condition"
              onChange={(e) => setCondition(e.target.value)}
            >
              <MenuItem value="Above">Above</MenuItem>
              <MenuItem value="Below">Below</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="AlertPrice"
            type="number"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            disabled={!ticker || !alertPrice}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Alert</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2">
          <TextField
            label="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            fullWidth
            autoFocus
          />
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={condition}
              label="Condition"
              onChange={(e) => setCondition(e.target.value)}
            >
              <MenuItem value="Above">Above</MenuItem>
              <MenuItem value="Below">Below</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="AlertPrice"
            type="number"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!ticker || !alertPrice}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs">
        <DialogTitle>Delete Alert</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this alert for{" "}
            <span className="font-semibold">{selectedAlert?.ticker}</span>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Alert;
