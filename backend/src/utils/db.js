const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    winston.info('MongoDB connected');
  } catch (err) {
    winston.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
