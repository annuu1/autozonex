const mongoose = require('mongoose');

const WatchListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbols: [
    {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const WatchList = mongoose.model('WatchList', WatchListSchema);

module.exports = WatchList;
