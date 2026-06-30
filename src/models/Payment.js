const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('CASH', 'UPI', 'Card', 'Bank Transfer', 'Cash'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded', 'PENDING_VERIFICATION', 'PAID', 'FAILED'),
    defaultValue: 'Pending',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  utrNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  purchaseOrderId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
  },
}, { timestamps: true });

module.exports = Payment;
