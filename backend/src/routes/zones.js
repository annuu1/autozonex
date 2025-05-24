const express = require('express');
const router = express.Router();
const { getDemandZones, getAllDemandZones, getDailyDemandZones } = require('../controllers/zones');
const auth = require('../middleware/auth');

router.get('/:ticker/:timeFrame', getDemandZones);
router.get('/allZones', getAllDemandZones)
router.get('/daily',auth, getDailyDemandZones)

module.exports = router;