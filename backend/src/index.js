const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');
const connectDB = require('./utils/db');

dotenv.config();

const app = express();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/candles', require('./routes/candleRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trade-journal', require('./routes/tradeJournalRoutes'))
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/symbols', require('./routes/symbolsRoutes'));
// app.use('/api/watchlist', require('./routes/watchlist'));

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
