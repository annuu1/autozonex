const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {
  createSettings,
  getSettings,
  updateSettings,
  deleteSettings
} = require('../controllers/settingsController');

const requireAuth = require('../middleware/requireAuth');

// Apply authentication middleware to all routes
router.use(requireAuth);

// Create new settings
router.post('/', auth, createSettings);

// Get settings for the authenticated user
router.get('/', auth, getSettings);

// Update settings for the authenticated user
router.put('/', auth, updateSettings);

// Delete settings for the authenticated user
router.delete('/', auth, deleteSettings);

module.exports = router;

