const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  variantId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  warehouseId: {
    type: DataTypes.UUID,
    allowNull: true,   // nullable — movements now tied to variants, not warehouses
  },
  type: {
    type: DataTypes.ENUM('IN', 'OUT', 'TRANSFER'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reference: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

module.exports = StockMovement;
