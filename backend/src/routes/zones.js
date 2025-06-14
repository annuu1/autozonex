const express = require('express');
const router = express.Router();
const { getDemandZones, getAllDemandZones, getDailyDemandZones,detectDemandZones } = require('../controllers/zones');
const auth = require('../middleware/auth');

router.get('/:ticker/:timeFrame', getDemandZones);
router.get('/allZones', getAllDemandZones)
router.get('/daily',auth, getDailyDemandZones)
router.post('/detect', auth, detectDemandZones)

module.exports = router;