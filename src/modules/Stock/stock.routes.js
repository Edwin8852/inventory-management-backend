const express = require('express');
const stockController = require('./stock.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Only Admin can do Stock In / Out / Transfer
router.post('/in', roleMiddleware(['ADMIN']), stockController.stockIn);
router.post('/out', roleMiddleware(['ADMIN']), stockController.stockOut);
router.post('/transfer', roleMiddleware(['ADMIN']), stockController.transferToStore);

// Admin and Supplier can view overview and alerts
router.get('/overview', roleMiddleware(['ADMIN', 'SUPPLIER']), stockController.getStockOverview);
router.get('/low-stock-alerts', roleMiddleware(['ADMIN']), stockController.getLowStockAlerts);

module.exports = router;
