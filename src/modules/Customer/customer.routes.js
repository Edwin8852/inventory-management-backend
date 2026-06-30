const express = require('express');
const customerController = require('./customer.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { createCustomerSchema, updateCustomerSchema } = require('./customer.validation');

const router = express.Router();

router.use(authMiddleware);

// Customer endpoints
router.get('/profile', roleMiddleware(['CUSTOMER']), customerController.getCustomerProfile);
router.get('/orders', roleMiddleware(['CUSTOMER']), customerController.getOrderHistory);

// Admin operations
router.use(roleMiddleware(['ADMIN']));
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', validationMiddleware(createCustomerSchema), customerController.createCustomer);
router.put('/:id', validationMiddleware(updateCustomerSchema), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
