require('dotenv').config();
const { sequelize } = require('./src/models');

async function syncProducts() {
  try {
    await sequelize.authenticate();
    console.log('Connection ok');
    
    // Drop dependent tables first
    await sequelize.query('DROP TABLE IF EXISTS "Returns" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "StockMovements" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Stocks" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "InvoiceItems" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "OrderItems" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "PurchaseOrderItems" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "ProductVariants" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Products" CASCADE;');
    
    // Sync all
    await sequelize.sync({ alter: true });
    
    console.log('Products and dependent tables dropped and synced successfully!');
  } catch (err) {
    console.error('Error syncing products:', err);
  } finally {
    process.exit();
  }
}

syncProducts();
