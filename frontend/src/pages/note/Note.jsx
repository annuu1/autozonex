import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getNotes, createNote, updateNote, deleteNote } from "../../api/note";
import AddNote from "../../components/dialogs/AddNote";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      // handle error
    }
  };

  // Add Note
  const handleAddNote = async (note) => {
    try {
      await createNote(note);
      setAddOpen(false);
      fetchNotes();
    } catch (err) {
      // handle error
    }
  };

  // Edit Note
  const handleEditClick = (note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await updateNote(selectedNote._id, { title: editTitle, content: editContent });
      setEditOpen(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      // handle error
    }
  };

  // Delete Note
  const handleDeleteClick = (note) => {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNote(selectedNote._id);
      setDeleteDialogOpen(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      // handle error
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
        >
          Add Note
        </Button>
      </Box>

      <Grid container spacing={2}>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <Grid span={12} sm={6} md={4} key={note._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {note.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEditClick(note)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteClick(note)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid span={12}>
            <Typography color="text.secondary" align="center">
              No notes found. Click "Add Note" to create one.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Add Note Dialog */}
      <AddNote
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddNote}
      />

      {/* Edit Note Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="Note"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this note?
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

export default Note;
