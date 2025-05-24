const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const auth = require('../middleware/auth');

// Get all notes for the authenticated user
router.get('/', auth, notesController.getNotes);

// Get a single note by ID
router.get('/:id', auth, notesController.getNoteById);

// Create a new note
router.post('/', auth, notesController.createNote);

// Update a note
router.put('/:id', auth, notesController.updateNote);

// Delete a note
router.delete('/:id', auth, notesController.deleteNote);

module.exports = router;
