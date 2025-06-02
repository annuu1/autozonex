const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getDashboardStats);
router.get('/pnl', dashboardController.getDashboardPnL);
router.get('/trade-score', dashboardController.getDashboardTradeScore);
router.get('/zones', dashboardController.getDashboardZones);

module.exports = router;
