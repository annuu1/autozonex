import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { createNote } from "../../api/note";

const AddNote = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Both title and note are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // Call the API helper to create the note
      await createNote({ title, content });
      setTitle("");
      setContent("");
      if (onSave) onSave({ title, content });
    } catch (err) {
      setError("Failed to add note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setError("");
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Note</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
          autoFocus
        />
        <TextField
          label="Note"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && (
          <div style={{ color: "red", marginTop: 8 }}>{error}</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNote;
