const { Payment, Invoice, sequelize } = require('../../models');

const recordPayment = async (paymentData) => {
  const { invoiceId, paymentMethod, amount, transactionId } = paymentData;

  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  const existingPayments = await Payment.sum('amount', { where: { invoiceId, status: 'Paid' } });
  const totalPaid = existingPayments || 0;

  if (totalPaid + amount > invoice.totalAmount) {
    throw new Error('Payment amount exceeds invoice total amount');
  }

  const payment = await Payment.create({
    invoiceId,
    paymentMethod,
    amount,
    transactionId,
    status: 'Paid',
  });

  return payment;
};

const getPayments = async () => {
  const { Order, PurchaseOrder } = require('../../models');
  return await Payment.findAll({
    include: [
      { model: Invoice },
      { model: Order },
      { model: PurchaseOrder }
    ],
    order: [['createdAt', 'DESC']]
  });
};

const getPaymentById = async (id) => {
  const payment = await Payment.findByPk(id, {
    include: [{ model: Invoice }]
  });
  if (!payment) throw new Error('Payment not found');
  return payment;
};

const verifyPayment = async (id, status, adminId) => {
  const payment = await Payment.findByPk(id);
  if (!payment) throw new Error('Payment not found');

  if (payment.status !== 'PENDING_VERIFICATION') {
    throw new Error('Payment is not pending verification');
  }

  const transaction = await sequelize.transaction();
  try {
    const isApproved = status === 'PAID';
    const paymentStatus = isApproved ? 'PAID' : 'FAILED';
    const orderStatus = isApproved ? 'PLACED' : 'PAYMENT_FAILED';

    await payment.update({
      status: paymentStatus,
      verifiedBy: adminId,
      verifiedAt: new Date()
    }, { transaction });

    if (payment.orderId) {
      const { Order, OrderItem } = require('../../models');
      const order = await Order.findByPk(payment.orderId, { include: [{ model: OrderItem, as: 'items' }], transaction });
      if (order) {
        await order.update({ status: orderStatus, paymentStatus: paymentStatus }, { transaction });

        // Deduct stock if approved
        if (isApproved) {
          const stockService = require('../Stock/stock.service');
          for (let item of order.items) {
            if (item.variantId) {
              await stockService.stockOut({
                variantId: item.variantId,
                quantity: item.quantity,
                reference: order.orderNumber
              });
            }
          }
        }
      }
    } else if (payment.purchaseOrderId) {
      const { PurchaseOrder } = require('../../models');
      const po = await PurchaseOrder.findByPk(payment.purchaseOrderId, { transaction });
      if (po) {
        await po.update({ status: orderStatus, paymentStatus: paymentStatus }, { transaction });
      }
    }

    await transaction.commit();
    return payment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  recordPayment,
  getPayments,
  getPaymentById,
  verifyPayment,
};
