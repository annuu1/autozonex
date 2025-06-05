const express = require('express');
const router = express.Router();
const { getCandles, getLTFCandles } = require('../controllers/candleController');

router.get('/:ticker/:timeFrame', getCandles);
router.get('/:ticker/:timeFrame/ltf', getLTFCandles);

module.exports = router;