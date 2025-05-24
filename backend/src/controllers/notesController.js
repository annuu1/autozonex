const Note = require('../models/Note');

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id; // assuming user is attached to req
    const notes = await Note.find({ userId: userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const userId = req.user.id;
    const note = await Note.findOne({ _id: req.params.id, userId: userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;
    const note = new Note({ userId: userId, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create note' });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: userId },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update note' });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
