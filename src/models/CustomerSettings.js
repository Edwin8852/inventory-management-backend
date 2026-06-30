const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerSettings = sequelize.define('CustomerSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  orderPreferences: {
    type: DataTypes.JSON,
    defaultValue: { defaultDelivery: 'Standard' },
  },
  notificationPreferences: {
    type: DataTypes.JSON,
    defaultValue: { email: true, sms: false },
  }
}, { timestamps: true });

module.exports = CustomerSettings;
