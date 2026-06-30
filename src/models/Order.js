const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  deliveryDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('Pending Payment', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'PAYMENT_PENDING', 'PAYMENT_FAILED', 'PLACED'),
    defaultValue: 'Pending Payment',
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'UPI', 'CASH'),
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('Cash Pending', 'Paid', 'PENDING_VERIFICATION', 'PAID', 'PENDING', 'FAILED'),
    allowNull: true,
  },
}, { timestamps: true });

module.exports = Order;
