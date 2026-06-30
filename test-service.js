require('dotenv').config();
const { sequelize } = require('./src/models');
const invoiceService = require('./src/modules/Invoice/invoice.service');

async function test() {
  try {
    await sequelize.authenticate();
    const invoices = await invoiceService.getInvoices({ role: 'ADMIN' });
    console.log('Success:', invoices.length);
  } catch (err) {
    console.error('Error in getInvoices:', err);
  } finally {
    process.exit();
  }
}

test();
