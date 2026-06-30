const dashboardService = require('./dashboard.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getAdminDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getAdminDashboard();
    return sendResponse(res, 200, true, 'Admin dashboard retrieved', stats);
  } catch (error) {
    next(error);
  }
};

const getSupplierDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getSupplierDashboard(req.user.id);
    return sendResponse(res, 200, true, 'Supplier dashboard retrieved', stats);
  } catch (error) {
    if (error.message === 'Supplier not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const getCustomerDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getCustomerDashboard(req.user.id);
    return sendResponse(res, 200, true, 'Customer dashboard retrieved', stats);
  } catch (error) {
    if (error.message === 'Customer not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getSupplierDashboard,
  getCustomerDashboard,
};
