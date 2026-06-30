require('dotenv').config();
const { sequelize } = require('./src/models');

async function syncSupplier() {
  try {
    await sequelize.authenticate();
    console.log('Connection ok');
    // Drop the enum type so it can be recreated cleanly
    await sequelize.query('DROP TYPE IF EXISTS "enum_Suppliers_status" CASCADE;');
    await sequelize.sync({ alter: true });
    console.log('Supplier table synced successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

syncSupplier();
