const { sequelize, Order, OrderItem, Product, Customer } = require('../../models');
const stockService = require('../Stock/stock.service');
const cartService = require('../Cart/cart.service');

const generateOrderNumber = async (transaction) => {
  const lastOrder = await Order.findOne({
    order: [['createdAt', 'DESC']],
    transaction
  });
  if (!lastOrder || !lastOrder.orderNumber) {
    return `ORD-${new Date().getFullYear()}-0001`;
  }
  const lastNumberStr = lastOrder.orderNumber.split('-').pop();
  const nextNumber = parseInt(lastNumberStr, 10) + 1;
  return `ORD-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;
};

const createOrder = async (customerId, orderData) => {
  const { items, paymentMethod, utrNumber } = orderData;
  const transaction = await sequelize.transaction();

  try {
    const orderNumber = await generateOrderNumber(transaction);
    let totalAmount = 0;

    const processedItems = items.map(item => {
      const itemTotal = item.quantity * item.retailPrice;
      totalAmount += itemTotal;
      return { ...item, total: itemTotal };
    });

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    let paymentStatus = 'PENDING';
    let orderStatus = 'Pending Payment';
    if (paymentMethod === 'CASH') {
      paymentStatus = 'PAID';
      orderStatus = 'PLACED';
    } else if (paymentMethod === 'UPI') {
      paymentStatus = 'PENDING_VERIFICATION';
      orderStatus = 'PAYMENT_PENDING';
    }

    const order = await Order.create({
      orderNumber,
      customerId,
      totalAmount,
      status: orderStatus,
      paymentMethod,
      paymentStatus,
      deliveryDate
    }, { transaction });

    for (let item of processedItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        retailPrice: item.retailPrice,
        total: item.total,
      }, { transaction });

      // Automatic Stock Deduction per item ONLY FOR CASH
      if (paymentMethod === 'CASH' && item.variantId) {
        try {
          await stockService.stockOut({
            variantId: item.variantId,
            quantity: item.quantity,
            reference: order.orderNumber
          });
        } catch (stockError) {
          console.warn(`Stock deduction failed for variant ${item.variantId} on order ${order.orderNumber}: ${stockError.message}`);
        }
      }
    }

    // Clear cart after successful order
    if (orderData.userId) {
      try { await cartService.clearCart(orderData.userId); } catch(e) { /* silent */ }
    }

    // Auto generate invoice on order creation
    let invoice = null;
    try {
      const invService = require('../Invoice/invoice.service');
      invoice = await invService.generateCustomerInvoice(order.id, transaction);
    } catch (err) {
      console.error('Auto Invoice Gen Failed:', err);
    }

    // Create Payment Record
    const Payment = require('../../models/Payment');
    await Payment.create({
      invoiceId: invoice ? invoice.id : null,
      orderId: order.id,
      paymentMethod,
      status: paymentStatus,
      amount: totalAmount,
      utrNumber: paymentMethod === 'UPI' ? utrNumber : null,
      paymentDate: new Date(),
    }, { transaction });

    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOrders = async (userRole, userId) => {
  const where = {};
  if (userRole === 'CUSTOMER') {
    const customer = await Customer.findOne({ where: { userId } });
    if (customer) {
      where.customerId = customer.id;
    } else {
      return [];
    }
  }

  return await Order.findAll({
    where,
    include: [{ model: Customer, attributes: ['phone', 'address'] }]
  });
};

const getOrderById = async (id, userRole, userId) => {
  const order = await Order.findByPk(id, {
    include: [
      { 
        model: OrderItem, 
        as: 'items', 
        include: [
          { model: Product, attributes: ['productName', 'sku'] },
          { model: sequelize.models.ProductVariant, as: 'variant', attributes: ['size'] }
        ] 
      },
      { model: Customer, attributes: ['userId', 'phone', 'address'] }
    ]
  });

  if (!order) throw new Error('Order not found');

  if (userRole === 'CUSTOMER' && order.Customer.userId !== userId) {
    throw new Error('Access denied');
  }

  return order;
};

const updateOrderStatus = async (id, statusData) => {
  const { status } = statusData;
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');

  const transaction = await sequelize.transaction();
  try {
    await order.update({ status }, { transaction });
    await transaction.commit();

    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
