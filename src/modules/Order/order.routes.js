const express = require('express');
const orderController = require('./order.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { createOrderSchema, updateOrderStatusSchema } = require('./order.validation');

const router = express.Router();

router.use(authMiddleware);

// Viewing routes
router.get('/', roleMiddleware(['ADMIN', 'CUSTOMER', 'SUPPLIER']), orderController.getOrders);
router.get('/:id', roleMiddleware(['ADMIN', 'CUSTOMER', 'SUPPLIER']), orderController.getOrderById);

// Customers and Admins place orders
router.post('/', roleMiddleware(['CUSTOMER', 'ADMIN']), validationMiddleware(createOrderSchema), orderController.createOrder);

// Admin updates status
router.put('/:id/status', roleMiddleware(['ADMIN']), validationMiddleware(updateOrderStatusSchema), orderController.updateOrderStatus);

// Admin marks cash payment as paid
router.patch('/:id/mark-paid', roleMiddleware(['ADMIN']), orderController.markAsPaid);

module.exports = router;
