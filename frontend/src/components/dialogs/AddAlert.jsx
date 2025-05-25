import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";

/**
 * AddAlertDialog
 * 
 * Props:
 * - open: boolean (dialog open state)
 * - onClose: function (called when dialog should close)
 * - onSubmit: function (called with alert data on submit)
 * - symbol: string (pre-filled symbol, optional)
 * - loading: boolean (show loading spinner on submit)
 * - error: string (error message to display)
 */
const conditionOptions = [
  { value: "gt", label: "Greater Than" },
  { value: "lt", label: "Less Than" },
  { value: "eq", label: "Equal To" },
];

const defaultForm = {
  symbol: "",
  condition: "gt",
  price: "",
  note: "",
};

const AddAlertDialog = ({
  open,
  onClose,
  onSubmit,
  symbol = "",
  loading = false,
  error = "",
}) => {
  const [form, setForm] = useState({
    ...defaultForm,
    symbol: symbol || "",
  });

  const [touched, setTouched] = useState({});

  React.useEffect(() => {
    if (open) {
      setForm({
        ...defaultForm,
        symbol: symbol || "",
      });
      setTouched({});
    }
  }, [open, symbol]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!form.symbol.trim()) errors.symbol = "Symbol is required";
    if (!form.price || isNaN(Number(form.price)))
      errors.price = "Valid price is required";
    if (!form.condition) errors.condition = "Condition is required";
    return errors;
  };

  const errors = validate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      symbol: true,
      price: true,
      condition: true,
    });
    if (Object.keys(errors).length === 0) {
      onSubmit({
        symbol: form.symbol.trim().toUpperCase(),
        condition: form.condition,
        price: Number(form.price),
        note: form.note.trim(),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Price Alert</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Symbol"
            name="symbol"
            value={form.symbol}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            margin="normal"
            disabled={!!symbol}
            error={touched.symbol && !!errors.symbol}
            helperText={touched.symbol && errors.symbol}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="condition-label">Condition</InputLabel>
            <Select
              labelId="condition-label"
              name="condition"
              value={form.condition}
              label="Condition"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.condition && !!errors.condition}
            >
              {conditionOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            margin="normal"
            type="number"
            error={touched.price && !!errors.price}
            helperText={touched.price && errors.price}
            inputProps={{ min: 0, step: "any" }}
          />
          <TextField
            label="Note (optional)"
            name="note"
            value={form.note}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? <CircularProgress size={22} /> : "Add Alert"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAlertDialog;
