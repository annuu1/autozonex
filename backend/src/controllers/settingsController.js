// src/controllers/settingsController.js
const Settings = require('../models/Settings');

// Create a new settings record
// Create new settings
const createSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const { riskPerTrade } = req.body;
        // Check if settings already exist for this user
        const existing = await Settings.findOne({ userId });
        if (existing) {
            return res.status(400).json({ error: 'Settings already exist for this user.' });
        }
        const settings = new Settings({ userId, riskPerTrade });
        await settings.save();
        res.status(201).json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get settings for a user
const getSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const settings = await Settings.findOne({ userId });
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found.' });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update settings for a user
const updateSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const update = req.body;
        const settings = await Settings.findOneAndUpdate(
            { userId },
            update,
            { new: true }
        );
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found.' });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete settings for a user
const deleteSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const settings = await Settings.findOneAndDelete({ userId });
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found.' });
        }
        res.json({ message: 'Settings deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createSettings, getSettings, updateSettings, deleteSettings };
