const express = require('express');
const supplierController = require('./supplier.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { createSupplierSchema, updateSupplierSchema } = require('./supplier.validation');

const router = express.Router();

router.use(authMiddleware);

// Profile endpoint for Suppliers
router.get('/profile', roleMiddleware(['SUPPLIER']), supplierController.getSupplierProfile);

// Admin and Supplier CRUD operations
router.use(roleMiddleware(['ADMIN', 'SUPPLIER']));
router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierController.getSupplierById);

// Only ADMIN can create/delete
router.use(roleMiddleware(['ADMIN']));
router.post('/', validationMiddleware(createSupplierSchema), supplierController.createSupplier);
router.put('/:id', validationMiddleware(updateSupplierSchema), supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
