const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  invoiceType: {
    type: DataTypes.ENUM('ADMIN', 'SUPPLIER', 'CUSTOMER'),
    allowNull: false,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Links to Customer Order'
  },
  purchaseOrderId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Links to Supplier Purchase Order'
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  subTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  gstAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELLED'),
    defaultValue: 'PENDING',
  }
}, { timestamps: true });

module.exports = Invoice;
