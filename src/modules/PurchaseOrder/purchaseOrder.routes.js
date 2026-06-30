const express = require('express');
const poController = require('./purchaseOrder.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { createPOSchema, updatePOStatusSchema } = require('./purchaseOrder.validation');

const router = express.Router();

router.use(authMiddleware);

// Admin and Supplier view routes
router.get('/', roleMiddleware(['ADMIN', 'SUPPLIER']), poController.getPurchaseOrders);
router.get('/:id', roleMiddleware(['ADMIN', 'SUPPLIER']), poController.getPurchaseOrderById);

// Admin-only mutation routes
router.post('/', roleMiddleware(['ADMIN', 'SUPPLIER']), validationMiddleware(createPOSchema), poController.createPurchaseOrder);
router.put('/:id/status', roleMiddleware(['ADMIN', 'SUPPLIER']), validationMiddleware(updatePOStatusSchema), poController.updatePOStatus);
router.patch('/:id/mark-paid', roleMiddleware(['ADMIN']), poController.markPOAsPaid);

module.exports = router;
