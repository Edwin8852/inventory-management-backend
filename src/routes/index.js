const express = require('express');
const authRoutes = require('../modules/Auth/auth.routes');
const productRoutes = require('../modules/Product/product.routes');
const warehouseRoutes = require('../modules/Warehouse/warehouse.routes');
const stockRoutes = require('../modules/Stock/stock.routes');
const supplierRoutes = require('../modules/Supplier/supplier.routes');
const customerRoutes = require('../modules/Customer/customer.routes');

const purchaseOrderRoutes = require('../modules/PurchaseOrder/purchaseOrder.routes');
const orderRoutes = require('../modules/Order/order.routes');
const invoiceRoutes = require('../modules/Invoice/invoice.routes');
const paymentRoutes = require('../modules/Payment/payment.routes');
const dashboardRoutes = require('../modules/Dashboard/dashboard.routes');
const categoryRoutes = require('../modules/Category/category.routes');
const brandRoutes = require('../modules/Brand/brand.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', require('../modules/User/user.routes'));
router.use('/products', productRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/stock', stockRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/customers', customerRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/orders', orderRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);
router.use('/returns', require('../modules/Return/return.routes'));
router.use('/settings', require('../modules/Setting/setting.routes'));
router.use('/cart', require('../modules/Cart/cart.routes'));
router.use('/dashboard', dashboardRoutes);

module.exports = router;
