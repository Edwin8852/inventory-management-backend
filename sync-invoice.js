require('dotenv').config();
const { sequelize, Invoice, InvoiceItem } = require('./src/models');

async function syncInvoice() {
  try {
    await sequelize.authenticate();
    console.log('Connection ok');
    await sequelize.query('DROP TABLE IF EXISTS "InvoiceItems" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Invoices" CASCADE;');
    await sequelize.sync({ alter: true });
    console.log('Invoice table altered successfully!');
  } catch (err) {
    console.error('Error syncing Invoice:', err);
  } finally {
    process.exit();
  }
}

syncInvoice();
