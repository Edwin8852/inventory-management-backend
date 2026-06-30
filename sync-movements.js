require('dotenv').config();
const { sequelize } = require('./src/models');

async function syncMovements() {
  try {
    await sequelize.authenticate();
    console.log('Connection ok');
    
    // Drop StockMovements to cleanly apply new ENUM and variantId column
    await sequelize.query('DROP TABLE IF EXISTS "StockMovements" CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS "enum_StockMovements_type" CASCADE;');
    await sequelize.sync({ alter: true });
    
    console.log('StockMovements synced successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

syncMovements();
