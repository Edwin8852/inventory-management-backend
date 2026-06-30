const { Return, Product, Invoice, InvoiceItem } = require('../../models');

const processReturn = async (data) => {
  const { invoiceId, productId, quantity, reason, refundAmount } = data;
  
  // Create Return record
  const returnRecord = await Return.create({
    invoiceId,
    productId,
    quantity,
    reason,
    refundAmount,
    status: 'APPROVED'
  });

  // Optional: Auto adjust inventory
  // Let's assume we increase stock back into a default warehouse
  try {
    const stockService = require('../Stock/stock.service');
    // We would need a default warehouse id. For simplicity, just finding one.
    const { Warehouse } = require('../../models');
    const wh = await Warehouse.findOne();
    if (wh) {
      await stockService.stockIn({
        productId,
        warehouseId: wh.id,
        quantity,
        reference: `RETURN-${returnRecord.id}`
      });
    }
  } catch (err) {
    console.error("Failed to restock returned item:", err);
  }

  return returnRecord;
};

const getReturns = async () => {
  return await Return.findAll({
    include: [
      { model: Product, attributes: ['productName', 'sku'] },
      { model: Invoice, attributes: ['invoiceNumber'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = {
  processReturn,
  getReturns
};
