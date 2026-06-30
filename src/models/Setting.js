const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    defaultValue: 'Garments ERP'
  },
  companyLogo: {
    type: DataTypes.STRING,
  },
  gstNumber: {
    type: DataTypes.STRING,
  },
  defaultGstRate: {
    type: DataTypes.INTEGER,
    defaultValue: 18,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  receiptFooter: {
    type: DataTypes.TEXT,
    defaultValue: 'Thank you for your business!',
  }
}, { timestamps: true });

module.exports = Setting;
