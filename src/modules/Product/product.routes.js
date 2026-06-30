const express = require('express');
const productController = require('./product.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { createProductSchema, updateProductSchema } = require('./product.validation');
const upload = require('../../shared/middleware/uploadMiddleware');

const router = express.Router();

// Publicly authenticated endpoints (All roles can view products)
router.use(authMiddleware);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin and Supplier endpoints
router.use(roleMiddleware(['ADMIN', 'SUPPLIER']));

router.post('/', upload.single('image'), validationMiddleware(createProductSchema), productController.createProduct);
router.put('/:id', upload.single('image'), validationMiddleware(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Variant CRUD
router.post('/:productId/variants', productController.createVariant);
router.put('/variants/:variantId', productController.updateVariant);
router.delete('/variants/:variantId', productController.deleteVariant);

module.exports = router;

