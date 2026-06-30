const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  poNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  warehouseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Pending Payment', 'Approved', 'Processing', 'Delivered', 'Cancelled', 'PAYMENT_PENDING', 'PAYMENT_FAILED', 'PLACED', 'Completed'),
    defaultValue: 'Draft',
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'UPI', 'CASH'),
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('Cash Pending', 'Paid', 'PENDING_VERIFICATION', 'PAID', 'PENDING', 'FAILED'),
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
}, { timestamps: true });

module.exports = PurchaseOrder;
