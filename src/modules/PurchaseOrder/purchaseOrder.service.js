const { sequelize, PurchaseOrder, PurchaseOrderItem, Product, Supplier, Warehouse } = require('../../models');
const stockService = require('../Stock/stock.service');
const cartService = require('../Cart/cart.service');

const generatePONumber = async (transaction) => {
  const lastPO = await PurchaseOrder.findOne({
    order: [['createdAt', 'DESC']],
    transaction
  });
  if (!lastPO || !lastPO.poNumber) {
    return `PO-${new Date().getFullYear()}-0001`;
  }
  const lastNumberStr = lastPO.poNumber.split('-').pop();
  const nextNumber = parseInt(lastNumberStr, 10) + 1;
  return `PO-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;
};

const createPurchaseOrder = async (poData) => {
  const { supplierId, warehouseId, items, paymentMethod, utrNumber, userId } = poData;
  const transaction = await sequelize.transaction();

  try {
    const poNumber = await generatePONumber(transaction);
    let totalAmount = 0;

    // Fetch products to validate MOQ and secure pricing
    const productIds = items.map(item => item.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction });
    const productMap = products.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

    // Calculate total quantity per product for MOQ validation
    const productQuantities = {};
    items.forEach(item => {
      if (!productQuantities[item.productId]) productQuantities[item.productId] = 0;
      productQuantities[item.productId] += item.quantity;
    });

    // Validate MOQ for each product
    for (const [pId, totalQty] of Object.entries(productQuantities)) {
      const product = productMap[pId];
      if (!product) throw new Error(`Product not found`);
      if (totalQty < product.minOrderQuantity) {
        throw new Error(`Minimum Order Quantity for ${product.productName} is ${product.minOrderQuantity} units.`);
      }
    }

    // Calculate total amount and prepare items
    const processedItems = items.map(item => {
      const product = productMap[item.productId];
      const wholesalePrice = parseFloat(product.wholesalePrice);
      const itemTotal = item.quantity * wholesalePrice;
      totalAmount += itemTotal;
      return {
        ...item,
        wholesalePrice,
        total: itemTotal,
      };
    });

    let paymentStatus = 'PENDING';
    let poStatus = 'Draft';
    if (paymentMethod === 'CASH') {
      paymentStatus = 'PAID';
      poStatus = 'Completed';
    } else if (paymentMethod === 'UPI') {
      paymentStatus = 'PAID';
      poStatus = 'Completed';
    }

    const po = await PurchaseOrder.create({
      poNumber,
      supplierId,
      warehouseId,
      totalAmount,
      status: poStatus,
      paymentMethod: paymentMethod || null,
      paymentStatus: paymentStatus || null,
    }, { transaction });

    for (let item of processedItems) {
      await PurchaseOrderItem.create({
        poId: po.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        wholesalePrice: item.wholesalePrice,
        total: item.total,
      }, { transaction });

      // Immediately update stock if order is Completed
      if (poStatus === 'Completed' && item.variantId) {
        await stockService.stockIn({
          variantId: item.variantId,
          quantity: item.quantity,
          reference: po.poNumber
        }, transaction);
      }
    }

    // Clear cart after successful PO
    if (userId) {
      try { await cartService.clearCart(userId); } catch(e) { /* silent */ }
    }

    // Generate Supplier Invoice upon PO creation
    let invoice = null;
    try {
      const invService = require('../Invoice/invoice.service');
      invoice = await invService.generateSupplierInvoice(po.id, transaction);
    } catch (err) {
      throw new Error('Auto Invoice Gen Failed: ' + err.message);
    }

    // Create Payment Record
    const Payment = require('../../models/Payment');
    await Payment.create({
      invoiceId: invoice ? invoice.id : null,
      purchaseOrderId: po.id,
      paymentMethod,
      status: paymentStatus,
      amount: totalAmount,
      utrNumber: paymentMethod === 'UPI' ? utrNumber : null,
      paymentDate: new Date(),
    }, { transaction });

    await transaction.commit();

    return po;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getPurchaseOrders = async (userRole, userId) => {
  const where = {};
  if (userRole === 'SUPPLIER') {
    const supplier = await Supplier.findOne({ where: { userId } });
    if (supplier) {
      where.supplierId = supplier.id;
    } else {
      return [];
    }
  }

  return await PurchaseOrder.findAll({
    where,
    include: [
      { model: Supplier, attributes: ['companyName'] },
      { model: Warehouse, attributes: ['warehouseName'] }
    ]
  });
};

const getPurchaseOrderById = async (id, userRole, userId) => {
  const po = await PurchaseOrder.findByPk(id, {
    include: [
      { 
        model: PurchaseOrderItem, 
        as: 'items', 
        include: [
          { model: Product, attributes: ['productName', 'sku'] },
          { model: sequelize.models.ProductVariant, as: 'variant', attributes: ['size'] }
        ] 
      },
      { model: Supplier, attributes: ['companyName', 'gstNumber', 'address', 'userId'] },
      { model: Warehouse, attributes: ['warehouseName', 'location'] }
    ]
  });
  if (!po) throw new Error('Purchase Order not found');

  if (userRole === 'SUPPLIER' && po.Supplier.userId !== userId) {
    throw new Error('Access denied');
  }

  return po;
};

const updatePOStatus = async (id, statusData) => {
  const { status } = statusData;
  const po = await getPurchaseOrderById(id);
  
  if (po.status === 'Delivered' || po.status === 'Cancelled') {
    throw new Error(`Cannot change status of a ${po.status} PO`);
  }

  const transaction = await sequelize.transaction();
  try {
    await po.update({ status }, { transaction });

    // Auto stock addition on Delivery
    if (status === 'Delivered') {
      const items = po.items;
      for (const item of items) {
        if (item.variantId) {
          await stockService.stockIn({
            variantId: item.variantId,
            quantity: item.quantity,
            reference: po.poNumber
          }, transaction); 
        }
      }
    }
    await transaction.commit();
    
    return po;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePOStatus,
};
