const express = require('express');
const invoiceController = require('./invoice.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { generateInvoiceSchema } = require('./invoice.validation');

const router = express.Router();

router.use(authMiddleware);

// Viewing routes
router.get('/', roleMiddleware(['ADMIN', 'SUPPLIER', 'CUSTOMER']), invoiceController.getInvoices);
router.get('/:id', roleMiddleware(['ADMIN', 'SUPPLIER', 'CUSTOMER']), invoiceController.getInvoiceById);

// Manual trigger for testing/admin usage
router.post('/generate', roleMiddleware(['ADMIN']), validationMiddleware(generateInvoiceSchema), invoiceController.triggerInvoiceGeneration);

module.exports = router;
