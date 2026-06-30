const express = require('express');
const dashboardController = require('./dashboard.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/admin', roleMiddleware(['ADMIN']), dashboardController.getAdminDashboard);
router.get('/supplier', roleMiddleware(['SUPPLIER']), dashboardController.getSupplierDashboard);
router.get('/customer', roleMiddleware(['CUSTOMER']), dashboardController.getCustomerDashboard);

module.exports = router;
