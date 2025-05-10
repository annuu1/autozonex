const express = require('express');
const router = express.Router();
const { getStockData } = require('../controllers/stocks');

router.get('/:ticker/history', getStockData);

module.exports = router;
