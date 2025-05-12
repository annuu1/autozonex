const express = require('express');
const router = express.Router();
const { getDemandZones, getAllDemandZones, getDailyDemandZones } = require('../controllers/zones');

router.get('/:ticker/:timeFrame', getDemandZones);
router.get('/allZones', getAllDemandZones)
router.get('/daily', getDailyDemandZones)

module.exports = router;