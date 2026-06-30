const poService = require('./purchaseOrder.service');
const { Supplier } = require('../../models');
const { sendResponse } = require('../../shared/utils/responseHandler');

const createPurchaseOrder = async (req, res, next) => {
  try {
    let poData = { ...req.body };

    if (req.user.role === 'SUPPLIER') {
      // Auto-inject supplierId from the logged-in supplier's profile
      const supplier = await Supplier.findOne({ where: { userId: req.user.id } });
      if (!supplier) return sendResponse(res, 403, false, 'Supplier profile not found. Contact Admin.');
      poData.supplierId = supplier.id;
    } else if (req.user.role === 'ADMIN' && !poData.supplierId) {
      return sendResponse(res, 400, false, 'supplierId is required when creating a PO as Admin.');
    }
    poData.userId = req.user.id;

    const po = await poService.createPurchaseOrder(poData);
    return sendResponse(res, 201, true, 'Purchase Order created successfully', po);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors.map(err => err.message);
      return sendResponse(res, 400, false, 'Database Validation Error', errorMessages);
    }
    
    // Surface business rule errors (MOQ violations etc.) as 400
    if (error.message.includes('Minimum Order Quantity') || error.message.includes('not found') || error.message.includes('Access denied')) {
      return sendResponse(res, 400, false, error.message);
    }
    console.error('PO Creation Error:', error);
    return sendResponse(res, 500, false, `Server Error: ${error.message} - Stack: ${error.stack}`);
  }
};

const getPurchaseOrders = async (req, res, next) => {
  try {
    const pos = await poService.getPurchaseOrders(req.user.role, req.user.id);
    return sendResponse(res, 200, true, 'Purchase Orders retrieved successfully', pos);
  } catch (error) {
    next(error);
  }
};

const getPurchaseOrderById = async (req, res, next) => {
  try {
    const po = await poService.getPurchaseOrderById(req.params.id, req.user.role, req.user.id);
    return sendResponse(res, 200, true, 'Purchase Order retrieved successfully', po);
  } catch (error) {
    if (error.message === 'Purchase Order not found' || error.message === 'Access denied') {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

const updatePOStatus = async (req, res, next) => {
  try {
    const po = await poService.updatePOStatus(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Purchase Order status updated', po);
  } catch (error) {
    if (error.message.includes('Cannot change status')) return sendResponse(res, 400, false, error.message);
    if (error.message === 'Purchase Order not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const markPOAsPaid = async (req, res, next) => {
  try {
    const { PurchaseOrder } = require('../../models');
    const po = await PurchaseOrder.findByPk(req.params.id);
    if (!po) return sendResponse(res, 404, false, 'Purchase Order not found');
    await po.update({ paymentStatus: 'Paid', status: 'Approved' });
    return sendResponse(res, 200, true, 'Payment marked as paid', po);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePOStatus,
  markPOAsPaid,
};
