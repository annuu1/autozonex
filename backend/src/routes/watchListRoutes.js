const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchListController');
const auth = require('../middleware/auth');

// Get all watchlists for the authenticated user
router.get('/', auth, watchListController.getWatchLists);

// Get a single watchlist by ID
router.get('/:id', auth, watchListController.getWatchListById);

// Create a new watchlist
router.post('/', auth, watchListController.createWatchList);

// Update a watchlist by ID
router.put('/:id', auth, watchListController.updateWatchList);

// Delete a watchlist by ID
router.delete('/:id', auth, watchListController.deleteWatchList);

// Add a symbol to a watchlist
router.post('/:id/symbols', auth, watchListController.addSymbolToWatchList);

// Remove a symbol from a watchlist
router.delete('/:id/symbols', auth, watchListController.removeSymbolFromWatchList);

module.exports = router;
