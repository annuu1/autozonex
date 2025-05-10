const express = require('express');
const router = express.Router();
const { getDemandZones } = require('../controllers/zones');

router.get('/:ticker/:timeFrame', getDemandZones); // Require timeFrame explicitly

module.exports = router;