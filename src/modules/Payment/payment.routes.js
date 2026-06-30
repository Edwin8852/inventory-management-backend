const express = require('express');
const paymentController = require('./payment.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { recordPaymentSchema } = require('./payment.validation');

const router = express.Router();

router.use(authMiddleware);

// Viewing routes
router.get('/', roleMiddleware(['ADMIN']), paymentController.getPayments);
router.get('/:id', roleMiddleware(['ADMIN', 'SUPPLIER', 'CUSTOMER']), paymentController.getPaymentById);

// Record payment
router.post('/', roleMiddleware(['ADMIN', 'CUSTOMER', 'SUPPLIER']), validationMiddleware(recordPaymentSchema), paymentController.recordPayment);

// Verify UPI payment
router.post('/:id/verify', roleMiddleware(['ADMIN']), paymentController.verifyPayment);

module.exports = router;
