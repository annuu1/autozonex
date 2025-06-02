const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/stats',auth, dashboardController.getDashboardStats);
router.get('/pnl',auth, dashboardController.getDashboardPnL);
router.get('/trade-score',auth, dashboardController.getDashboardTradeScore);
router.get('/zones',auth, dashboardController.getDashboardZones);

module.exports = router;
