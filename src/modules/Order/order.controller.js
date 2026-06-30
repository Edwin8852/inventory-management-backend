const orderService = require('./order.service');
const { Customer } = require('../../models');
const { sendResponse } = require('../../shared/utils/responseHandler');

const createOrder = async (req, res, next) => {
  try {
    let customerId = null;
    if (req.user.role === 'ADMIN') {
      customerId = req.body.customerId || null;
    } else {
      const customer = await Customer.findOne({ where: { userId: req.user.id } });
      if (!customer) return sendResponse(res, 403, false, 'Only registered customers can place orders');
      customerId = customer.id;
    }

    const order = await orderService.createOrder(customerId, { ...req.body, userId: req.user.id });
    return sendResponse(res, 201, true, 'Order created successfully', order);
  } catch (error) {
    if (error.message.includes('Insufficient stock quantity')) {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.user.role, req.user.id);
    return sendResponse(res, 200, true, 'Orders retrieved successfully', orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.role, req.user.id);
    return sendResponse(res, 200, true, 'Order retrieved successfully', order);
  } catch (error) {
    if (error.message === 'Order not found' || error.message === 'Access denied') {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Order status updated', order);
  } catch (error) {
    if (error.message === 'Order not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const markAsPaid = async (req, res, next) => {
  try {
    const { Order } = require('../../models');
    const order = await Order.findByPk(req.params.id);
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    await order.update({ paymentStatus: 'Paid', status: 'Confirmed' });
    return sendResponse(res, 200, true, 'Payment marked as paid', order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  markAsPaid,
};
