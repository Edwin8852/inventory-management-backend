const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  gstNumber: {
    type: DataTypes.STRING,
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
}, {
  timestamps: true,
});

module.exports = Customer;
