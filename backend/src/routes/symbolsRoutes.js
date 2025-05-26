const express = require('express');
const router = express.Router();
const symbolsController = require('../controllers/symbolsController');
const auth = require('../middleware/auth');

// Get all symbols (protected)
router.get('/', auth, symbolsController.getAllSymbols);

// Get a single symbol by ID (protected)
router.get('/:id', auth, symbolsController.getSymbolById);

// Create a new symbol (protected)
router.post('/', auth, symbolsController.createSymbol);

// Update a symbol by ID (protected)
router.put('/:id', auth, symbolsController.updateSymbol);

// Delete a symbol by ID (protected)
router.delete('/:id', auth, symbolsController.deleteSymbol);

// Add multiple symbols at once (protected)
router.post('/bulk', auth, symbolsController.addMultipleSymbols);

//search symbols
router.get('/search/:term', symbolsController.searchSymbols);

module.exports = router;

