const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemSetting = sequelize.define('SystemSetting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  configData: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  }
}, { 
  timestamps: true,
  tableName: 'system_settings'
});

module.exports = SystemSetting;
