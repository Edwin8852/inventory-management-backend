const { sequelize, Invoice, InvoiceItem, Order, OrderItem, PurchaseOrder, PurchaseOrderItem, Product, Customer, Supplier, User } = require('../../models');

const generateInvoiceNumber = async (type, transaction) => {
  const lastInvoice = await Invoice.findOne({
    where: { invoiceType: type },
    order: [['createdAt', 'DESC']],
    transaction
  });
  const prefix = type === 'CUSTOMER' ? 'INV-C' : (type === 'SUPPLIER' ? 'INV-S' : 'INV-A');
  
  if (!lastInvoice || !lastInvoice.invoiceNumber) {
    return `${prefix}-${new Date().getFullYear()}-0001`;
  }
  
  const lastNumberStr = lastInvoice.invoiceNumber.split('-').pop();
  const nextNumber = parseInt(lastNumberStr, 10) + 1;
  return `${prefix}-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;
};

const generateCustomerInvoice = async (orderId, passedTx = null) => {
  const order = await Order.findByPk(orderId, {
    include: [{ model: OrderItem, as: 'items' }],
    transaction: passedTx
  });

  if (!order) throw new Error('Order not found');

  const existingInvoice = await Invoice.findOne({ where: { orderId: orderId, invoiceType: 'CUSTOMER' }, transaction: passedTx });
  if (existingInvoice) return existingInvoice;

  const transaction = passedTx || await sequelize.transaction();

  try {
    const invoiceNumber = await generateInvoiceNumber('CUSTOMER', transaction);
    let subTotal = 0;
    let gstAmount = 0;
    
    const productIds = order.items.map(i => i.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction });
    const productMap = products.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

    for (const item of order.items) {
      const product = productMap[item.productId];
      const itemTotal = parseFloat(item.total);
      subTotal += itemTotal;
      const gstPct = parseFloat(product.gstPercentage) || 18.0;
      gstAmount += itemTotal * (gstPct / 100);
    }
    
    const totalAmount = subTotal + gstAmount;

    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceType: 'CUSTOMER',
      orderId: orderId,
      customerId: order.customerId,
      subTotal,
      gstAmount,
      totalAmount,
      status: 'PENDING'
    }, { transaction });

    for (const item of order.items) {
      await InvoiceItem.create({
        invoiceId: invoice.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.retailPrice,
        total: item.total,
      }, { transaction });
    }

    // Generate ADMIN invoice alongside CUSTOMER invoice
    const adminInvoiceNumber = await generateInvoiceNumber('ADMIN', transaction);
    const adminInvoice = await Invoice.create({
      invoiceNumber: adminInvoiceNumber,
      invoiceType: 'ADMIN',
      orderId: orderId,
      customerId: order.customerId,
      subTotal,
      gstAmount,
      totalAmount,
      status: 'PENDING'
    }, { transaction });
    for (const item of order.items) {
      await InvoiceItem.create({
        invoiceId: adminInvoice.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.retailPrice,
        total: item.total,
      }, { transaction });
    }

    if (!passedTx) await transaction.commit();
    return invoice;
  } catch (error) {
    if (!passedTx) await transaction.rollback();
    throw error;
  }
};

const generateSupplierInvoice = async (poId, passedTx = null) => {
  const po = await PurchaseOrder.findByPk(poId, {
    include: [{ model: PurchaseOrderItem, as: 'items' }],
    transaction: passedTx
  });

  if (!po) throw new Error('Purchase Order not found');

  const existingInvoice = await Invoice.findOne({ where: { purchaseOrderId: poId, invoiceType: 'SUPPLIER' }, transaction: passedTx });
  if (existingInvoice) return existingInvoice;

  const transaction = passedTx || await sequelize.transaction();

  try {
    const invoiceNumber = await generateInvoiceNumber('SUPPLIER', transaction);
    let subTotal = 0;
    let gstAmount = 0;
    
    const productIds = po.items.map(i => i.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction });
    const productMap = products.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

    for (const item of po.items) {
      const product = productMap[item.productId];
      const itemTotal = parseFloat(item.total);
      subTotal += itemTotal;
      const gstPct = parseFloat(product.gstPercentage) || 18.0;
      gstAmount += itemTotal * (gstPct / 100);
    }
    
    const totalAmount = subTotal + gstAmount;

    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceType: 'SUPPLIER',
      purchaseOrderId: poId,
      supplierId: po.supplierId,
      subTotal,
      gstAmount,
      totalAmount,
      status: 'PENDING'
    }, { transaction });

    for (const item of po.items) {
      await InvoiceItem.create({
        invoiceId: invoice.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.wholesalePrice,
        total: item.total,
      }, { transaction });
    }

    // Generate ADMIN invoice alongside SUPPLIER invoice
    const adminInvoiceNumber = await generateInvoiceNumber('ADMIN', transaction);
    const adminInvoice = await Invoice.create({
      invoiceNumber: adminInvoiceNumber,
      invoiceType: 'ADMIN',
      purchaseOrderId: poId,
      supplierId: po.supplierId,
      subTotal,
      gstAmount,
      totalAmount,
      status: 'PENDING'
    }, { transaction });
    for (const item of po.items) {
      await InvoiceItem.create({
        invoiceId: adminInvoice.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.wholesalePrice,
        total: item.total,
      }, { transaction });
    }

    if (!passedTx) await transaction.commit();
    return invoice;
  } catch (error) {
    if (!passedTx) await transaction.rollback();
    throw error;
  }
};

const getInvoices = async (user, filters = {}) => {
  const where = { ...filters };

  // Role-based filtering
  if (user.role === 'SUPPLIER') {
    where.invoiceType = 'SUPPLIER';
    if (user.supplier) {
      where.supplierId = user.supplier.id;
    }
  } else if (user.role === 'CUSTOMER') {
    where.invoiceType = 'CUSTOMER';
    if (user.customer) {
      where.customerId = user.customer.id;
    }
  } else if (user.role === 'ADMIN') {
    // Admin can view any type, filter applied through query params
  }

  return await Invoice.findAll({
    where,
    include: [
      { model: InvoiceItem, as: 'items', include: [{ model: Product, attributes: ['productName', 'sku', 'wholesalePrice', 'retailPrice'] }] },
      { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] },
      { model: Supplier, as: 'supplier', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] }
    ]
  });
};

const getInvoiceById = async (id, user) => {
  const invoice = await Invoice.findByPk(id, {
    include: [
      { model: InvoiceItem, as: 'items', include: [{ model: Product, attributes: ['productName', 'sku', 'wholesalePrice', 'retailPrice'] }] },
      { model: Customer, as: 'customer', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] },
      { model: Supplier, as: 'supplier', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] },
      { model: Order, as: 'order' },
      { model: PurchaseOrder, as: 'purchaseOrder' }
    ]
  });
  
  if (!invoice) throw new Error('Invoice not found');

  // RBAC checks for individual invoice
  if (user.role === 'SUPPLIER' && (invoice.invoiceType !== 'SUPPLIER' || invoice.supplierId !== user.supplier?.id)) {
    throw new Error('Access denied');
  }
  if (user.role === 'CUSTOMER' && (invoice.invoiceType !== 'CUSTOMER' || invoice.customerId !== user.customer?.id)) {
    throw new Error('Access denied');
  }

  return invoice;
};

module.exports = {
  generateCustomerInvoice,
  generateSupplierInvoice,
  getInvoices,
  getInvoiceById,
};
