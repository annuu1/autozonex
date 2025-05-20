const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

// Public route to create a new user
router.post('/', usersController.createUser);

// Protected routes (require authentication)
router.get('/', auth, usersController.getAllUsers);
router.get('/:id', auth, usersController.getUserById);
router.put('/:id', auth, usersController.updateUser);
router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;
