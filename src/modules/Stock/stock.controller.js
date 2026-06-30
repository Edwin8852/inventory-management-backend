const stockService = require('./stock.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const stockIn = async (req, res, next) => {
  try {
    const result = await stockService.stockIn(req.body);
    return sendResponse(res, 200, true, 'Stock IN successful', result);
  } catch (error) {
    if (['Variant not found'].includes(error.message)) {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

const stockOut = async (req, res, next) => {
  try {
    const result = await stockService.stockOut(req.body);
    return sendResponse(res, 200, true, 'Stock OUT successful', result);
  } catch (error) {
    if (['Variant not found', 'Insufficient store stock quantity'].includes(error.message)) {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const transferToStore = async (req, res, next) => {
  try {
    const result = await stockService.transferToStore(req.body);
    return sendResponse(res, 200, true, 'Stock transferred to store successfully', result);
  } catch (error) {
    if (['Variant not found', 'Insufficient warehouse stock to transfer'].includes(error.message)) {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const getStockOverview = async (req, res, next) => {
  try {
    const variants = await stockService.getStockOverview();
    
    const uniqueProducts = new Set(variants.map(v => v.productId));
    const totalProducts = uniqueProducts.size;
    const totalStock = variants.reduce((sum, v) => sum + (v.warehouseStock || 0) + (v.storeStock || 0), 0);
    const lowStockItems = variants.filter(v => (v.storeStock || 0) < 10);

    return res.status(200).json({
      success: true,
      totalProducts,
      totalStock,
      lowStockItems,
      data: variants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stock overview',
      error: error.message
    });
  }
};

const getLowStockAlerts = async (req, res, next) => {
  try {
    const threshold = req.query.threshold ? parseInt(req.query.threshold) : 10;
    const alerts = await stockService.getLowStockAlerts(threshold);
    return sendResponse(res, 200, true, 'Low stock alerts retrieved', alerts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stockIn,
  stockOut,
  transferToStore,
  getStockOverview,
  getLowStockAlerts,
};
