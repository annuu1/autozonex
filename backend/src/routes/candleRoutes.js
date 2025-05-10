const express = require('express');
const router = express.Router();
const { getCandles } = require('../controllers/candleController');

router.get('/:ticker/:timeFrame', getCandles);

module.exports = router;