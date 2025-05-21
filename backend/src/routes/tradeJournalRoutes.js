const express = require('express');
const router = express.Router();
const tradeJournalController = require('../controllers/tradeJournalController');
const auth = require('../middleware/auth');

// Get all trade journal entries for the current user
router.get('/', auth, tradeJournalController.getAllTradeJournals);

// Get a specific trade journal entry by ID
// router.get('/:id', auth, tradeJournalController.getTradeJournalById);

// Create a new trade journal entry
router.post('/', auth, tradeJournalController.createTradeJournal);

// Get a specific trade journal entry by ID
router.get('/:id', auth, tradeJournalController.getTradeJournal);

// Update an existing trade journal entry by ID
router.put('/:id', auth, tradeJournalController.updateTradeJournal);

// Delete a trade journal entry by ID
router.delete('/:id', auth, tradeJournalController.deleteTradeJournal);

// Get trade statistics for the current user
router.get('/statistics', auth, tradeJournalController.getTradeStatistics);

module.exports = router;
