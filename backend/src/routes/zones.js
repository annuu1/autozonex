const express = require('express');
const router = express.Router();
const { getDemandZones, getAllDemandZones } = require('../controllers/zones');

router.get('/:ticker/:timeFrame', getDemandZones);
router.get('/allZones', getAllDemandZones)

module.exports = router;