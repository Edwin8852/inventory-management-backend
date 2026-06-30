const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  brand: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  retailPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  wholesalePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  gstPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 18.0,
  },
  minOrderQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  image: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'),
    defaultValue: 'ACTIVE',
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Product;
