const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    riskPerTrade: {
        type: Number,
        default: 0.01,
    },
    telegramChatId: {
        type: String,
        default: null,
    },    
})

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;