const express = require('express');
const warehouseController = require('./warehouse.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { createWarehouseSchema, updateWarehouseSchema } = require('./warehouse.validation');

const router = express.Router();

// Authentication required for all routes
router.use(authMiddleware);

// Only Admin and Supplier can access Warehouse information
router.use(roleMiddleware(['ADMIN', 'SUPPLIER']));

router.get('/', warehouseController.getWarehouses);
router.get('/:id', warehouseController.getWarehouseById);

// Admin only can mutate Warehouse data
router.post('/', roleMiddleware(['ADMIN']), validationMiddleware(createWarehouseSchema), warehouseController.createWarehouse);
router.put('/:id', roleMiddleware(['ADMIN']), validationMiddleware(updateWarehouseSchema), warehouseController.updateWarehouse);
router.delete('/:id', roleMiddleware(['ADMIN']), warehouseController.deleteWarehouse);

module.exports = router;
