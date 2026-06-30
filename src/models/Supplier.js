const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  supplierCode: {
    type: DataTypes.STRING,
    unique: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPerson: {
    type: DataTypes.STRING,
  },
  gstNumber: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  panNumber: {
    type: DataTypes.STRING,
  },
  billingAddress: {
    type: DataTypes.TEXT,
  },
  dispatchAddress: {
    type: DataTypes.TEXT,
  },
  bankName: {
    type: DataTypes.STRING,
  },
  accountNumber: {
    type: DataTypes.STRING,
  },
  ifscCode: {
    type: DataTypes.STRING,
  },
  paymentTerms: {
    type: DataTypes.STRING,
  },
  creditLimit: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Supplier;
