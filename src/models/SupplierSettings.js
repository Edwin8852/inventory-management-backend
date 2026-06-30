const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SupplierSettings = sequelize.define('SupplierSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  businessName: {
    type: DataTypes.STRING,
  },
  gstNumber: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  bankDetails: {
    type: DataTypes.TEXT,
  },
  notificationPreferences: {
    type: DataTypes.JSON,
    defaultValue: { email: true, sms: false },
  }
}, { timestamps: true });

module.exports = SupplierSettings;
