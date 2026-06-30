const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const Supplier = require('./Supplier');
const Customer = require('./Customer');
const Warehouse = require('./Warehouse');
const Stock = require('./Stock');
const StockMovement = require('./StockMovement');
const PurchaseOrder = require('./PurchaseOrder');
const PurchaseOrderItem = require('./PurchaseOrderItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');
const Payment = require('./Payment');
const Return = require('./Return');
const AdminSettings = require('./AdminSettings');
const SupplierSettings = require('./SupplierSettings');
const CustomerSettings = require('./CustomerSettings');
const SystemSetting = require('./SystemSetting');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Category = require('./Category');
const Brand = require('./Brand');

// Define Relationships

// User hasOne Supplier / Supplier belongsTo User
User.hasOne(Supplier, { foreignKey: 'userId', as: 'supplier' });
Supplier.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User hasOne Customer / Customer belongsTo User
User.hasOne(Customer, { foreignKey: 'userId', as: 'customer' });
Customer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Supplier Products
Supplier.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

// Product Variants
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Product and Warehouse many-to-many through Stock
Product.hasMany(Stock, { foreignKey: 'productId' });
Stock.belongsTo(Product, { foreignKey: 'productId' });

Warehouse.hasMany(Stock, { foreignKey: 'warehouseId' });
Stock.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

// Stock Movements
Product.hasMany(StockMovement, { foreignKey: 'productId' });
StockMovement.belongsTo(Product, { foreignKey: 'productId' });

Warehouse.hasMany(StockMovement, { foreignKey: 'warehouseId' });
StockMovement.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

// Purchase Orders
Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplierId' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });

Warehouse.hasMany(PurchaseOrder, { foreignKey: 'warehouseId' });
PurchaseOrder.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'poId', as: 'items' });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'poId' });

Product.hasMany(PurchaseOrderItem, { foreignKey: 'productId' });
PurchaseOrderItem.belongsTo(Product, { foreignKey: 'productId' });

ProductVariant.hasMany(PurchaseOrderItem, { foreignKey: 'variantId' });
PurchaseOrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

// Customer Orders
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

// Invoices
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Product.hasMany(InvoiceItem, { foreignKey: 'productId' });
InvoiceItem.belongsTo(Product, { foreignKey: 'productId' });

ProductVariant.hasMany(InvoiceItem, { foreignKey: 'variantId' });
InvoiceItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

Supplier.hasMany(Invoice, { foreignKey: 'supplierId' });
Invoice.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

Customer.hasMany(Invoice, { foreignKey: 'customerId' });
Invoice.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Order.hasOne(Invoice, { foreignKey: 'orderId' });
Invoice.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

PurchaseOrder.hasOne(Invoice, { foreignKey: 'purchaseOrderId', as: 'purchaseInvoice' });
Invoice.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

User.hasMany(Invoice, { foreignKey: 'createdBy' });
Invoice.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Payments
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

PurchaseOrder.hasMany(Payment, { foreignKey: 'purchaseOrderId', as: 'payments' });
Payment.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId' });

// Returns
Invoice.hasMany(Return, { foreignKey: 'invoiceId' });
Return.belongsTo(Invoice, { foreignKey: 'invoiceId' });

Product.hasMany(Return, { foreignKey: 'productId' });
Return.belongsTo(Product, { foreignKey: 'productId' });

// Cart & CartItems
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

ProductVariant.hasMany(CartItem, { foreignKey: 'variantId' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

// Settings
Supplier.hasOne(SupplierSettings, { foreignKey: 'supplierId', as: 'settings' });
SupplierSettings.belongsTo(Supplier, { foreignKey: 'supplierId' });

Customer.hasOne(CustomerSettings, { foreignKey: 'customerId', as: 'settings' });
CustomerSettings.belongsTo(Customer, { foreignKey: 'customerId' });

// Sync database function
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Set force: false to avoid dropping tables in production.
    // alter: true updates tables to match models
    await sequelize.sync({ force: false, alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Product,
  ProductVariant,
  Supplier,
  Customer,
  Warehouse,
  Stock,
  StockMovement,
  PurchaseOrder,
  PurchaseOrderItem,
  Order,
  OrderItem,
  Invoice,
  InvoiceItem,
  Payment,
  Return,
  AdminSettings,
  SupplierSettings,
  CustomerSettings,
  SystemSetting,
  Cart,
  CartItem,
  Category,
  Brand
};
