const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
  },
  size: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  },
  warehouseStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  storeStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = ProductVariant;
