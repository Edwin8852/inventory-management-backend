const express = require('express');
const cartController = require('./cart.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/', roleMiddleware(['CUSTOMER', 'SUPPLIER']), cartController.getCart);
router.post('/items', roleMiddleware(['CUSTOMER', 'SUPPLIER']), cartController.addToCart);
router.put('/items/:itemId', roleMiddleware(['CUSTOMER', 'SUPPLIER']), cartController.updateCartItem);
router.delete('/items/:itemId', roleMiddleware(['CUSTOMER', 'SUPPLIER']), cartController.removeFromCart);
router.delete('/clear', roleMiddleware(['CUSTOMER', 'SUPPLIER']), cartController.clearCart);

module.exports = router;
