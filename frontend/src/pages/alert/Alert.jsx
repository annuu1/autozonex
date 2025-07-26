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
  Tabs,
  Tab,
  TextField as MuiTextField,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { createAlert, getAlerts } from "../../api/alert";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/useSettings";
import { styled } from "@mui/material/styles";

const StyledListItem = styled(ListItem)(({ theme, status }) => ({
  transition: "all 0.3s ease-in-out",
  borderLeft: `4px solid ${
    status === "Not Sent" ? theme.palette.warning.main : theme.palette.success.main
  }`,
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.grey[50],
  },
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
}));

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [percentFilter, setPercentFilter] = useState("");

  // Form state
  const [ticker, setTicker] = useState("");
  const [condition, setCondition] = useState("Above");
  const [alertPrice, setAlertPrice] = useState("");
  const [note, setNote] = useState("");
  const { user } = useAuth();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      const alerts = await getAlerts(user.email);
      setAlerts(alerts.data.alerts);
      setLoading(false);
    };
    fetchAlerts();
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
    setCondition(toProperCase(alert.condition));
    setAlertPrice(alert.alertPrice);
    setNote(alert.note || "");
    setEditDialogOpen(true);
  };

  const handleDelete = (alert) => {
    setSelectedAlert(alert);
    setDeleteDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!settings) {
      window.alert("To get alert on telegram, you should set your telegram chat id in settings");
      return;
    }

    const alert = await createAlert({
      userEmail: user.email,
      ticker,
      condition,
      alertPrice: parseFloat(alertPrice),
      note,
      telegramChatId: settings.telegramChatId,
    });

    if (alert.success) {
      setAlerts([
        ...alerts,
        {
          id: Date.now(),
          ticker,
          condition,
          alertPrice: parseFloat(alertPrice),
          note,
          dayLow: null,
          triggerNotificationStatus: "Not Sent",
        },
      ]);
      setAddDialogOpen(false);
    } else {
      window.alert(alert.message);
    }
  };

  const handleEditSubmit = () => {
    setAlerts(
      alerts.map((a) =>
        a.id === selectedAlert.id
          ? { ...a, ticker, condition, alertPrice: parseFloat(alertPrice), note }
          : a
      )
    );
    setEditDialogOpen(false);
    setSelectedAlert(null);
  };

  const handleDeleteConfirm = () => {
    setAlerts(alerts.filter((a) => a.id !== selectedAlert.id));
    setDeleteDialogOpen(false);
    setSelectedAlert(null);
  };

  function toProperCase(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const calculatePercentDiff = (alertPrice, dayLow) => {
    if (!dayLow || !alertPrice) return null;
    const diff = ((dayLow - alertPrice) / alertPrice) * 100;
    return diff.toFixed(2);
  };

  const filterAlerts = (alerts) => {
    if (!percentFilter) return alerts;
    const filterValue = parseFloat(percentFilter);
    if (isNaN(filterValue)) return alerts;
    return alerts.filter((alert) => {
      const percentDiff = calculatePercentDiff(alert.alertPrice, alert.dayLow);
      return percentDiff !== null && Math.abs(percentDiff) <= filterValue;
    });
  };

  const sentAlerts = filterAlerts(alerts.filter((alert) => alert.triggerNotificationStatus !== "Not Sent"));
  const unsentAlerts = filterAlerts(alerts.filter((alert) => alert.triggerNotificationStatus === "Not Sent"));

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full animate-spin"></div>
          <div className="ml-4 text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Box className="flex flex-col items-center w-full min-h-screen bg-gray-50 py-8">
      <Paper className="w-full max-w-2xl p-6 shadow-md" sx={{ borderRadius: 2 }}>
        <Box className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-bold flex items-center gap-2">
            <NotificationsActiveIcon sx={{ color: "primary.main", fontSize: 32 }} />
            Alerts
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            size="small"
            sx={{ borderRadius: 20, textTransform: "none", fontWeight: 600 }}
          >
            New Alert
          </Button>
        </Box>
        <Box className="mb-4">
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Unsent" sx={{ textTransform: "none", fontWeight: 600 }} />
            <Tab label="Sent" sx={{ textTransform: "none", fontWeight: 600 }} />
          </Tabs>
          <MuiTextField
            label="Max % Difference"
            type="number"
            value={percentFilter}
            onChange={(e) => setPercentFilter(e.target.value)}
            className="mt-4"
            size="small"
            placeholder="Enter max % difference"
            sx={{ maxWidth: 200 }}
            InputProps={{
              endAdornment: <Typography color="textSecondary">%</Typography>,
            }}
          />
        </Box>
        <List>
          {(tabValue === 0 ? unsentAlerts : sentAlerts).length === 0 ? (
            <Typography className="text-center text-gray-500 py-8">
              No {tabValue === 0 ? "unsent" : "sent"} alerts set.
            </Typography>
          ) : (
            (tabValue === 0 ? unsentAlerts : sentAlerts).map((alert) => (
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
                        color={alert.condition === "Above" ? "success" : "default"}
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
                              ? "warning"
                              : "default"
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
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(alert)}
                    className="mr-2"
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(alert)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </StyledListItem>
            ))
          )}
        </List>
      </Paper>

      {/* Add Alert Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Add New Alert
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          <TextField
            label="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            fullWidth
            autoFocus
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={condition}
              label="Condition"
              onChange={(e) => setCondition(e.target.value)}
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            disabled={!ticker || !alertPrice}
            sx={{ textTransform: "none", borderRadius: 20 }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Alert Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Edit Alert
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          <TextField
            label="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            fullWidth
            autoFocus
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={condition}
              label="Condition"
              onChange={(e) => setCondition(e.target.value)}
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!ticker || !alertPrice}
            sx={{ textTransform: "none", borderRadius: 20 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          Delete Alert
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete this alert for{" "}
            <span className="font-semibold">{selectedAlert?.ticker}</span>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{ textTransform: "none", borderRadius: 20 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Alert;