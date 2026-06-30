const settingService = require('./setting.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await settingService.getAdminSettings();
    return sendResponse(res, 200, true, 'Admin Settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

const updateAdminSettings = async (req, res, next) => {
  try {
    if (req.file) req.body.companyLogo = `/uploads/${req.file.filename}`;
    const settings = await settingService.updateAdminSettings(req.body);
    return sendResponse(res, 200, true, 'Admin Settings updated', settings);
  } catch (error) {
    next(error);
  }
};

const getSupplierSettings = async (req, res, next) => {
  try {
    if (!req.user.supplier) return sendResponse(res, 403, false, 'Supplier profile not found');
    const settings = await settingService.getSupplierSettings(req.user.supplier.id);
    return sendResponse(res, 200, true, 'Supplier Settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

const updateSupplierSettings = async (req, res, next) => {
  try {
    if (!req.user.supplier) return sendResponse(res, 403, false, 'Supplier profile not found');
    const settings = await settingService.updateSupplierSettings(req.user.supplier.id, req.body);
    return sendResponse(res, 200, true, 'Supplier Settings updated', settings);
  } catch (error) {
    next(error);
  }
};

const getCustomerSettings = async (req, res, next) => {
  try {
    if (!req.user.customer) return sendResponse(res, 403, false, 'Customer profile not found');
    const settings = await settingService.getCustomerSettings(req.user.customer.id);
    return sendResponse(res, 200, true, 'Customer Settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

const updateCustomerSettings = async (req, res, next) => {
  try {
    if (!req.user.customer) return sendResponse(res, 403, false, 'Customer profile not found');
    const settings = await settingService.updateCustomerSettings(req.user.customer.id, req.body);
    return sendResponse(res, 200, true, 'Customer Settings updated', settings);
  } catch (error) {
    next(error);
  }
};

const getSystemSettings = async (req, res, next) => {
  try {
    const { category } = req.params;
    const settings = await settingService.getSystemSettings(category);
    return sendResponse(res, 200, true, `System Settings (${category}) retrieved`, settings);
  } catch (error) {
    next(error);
  }
};

const updateSystemSettings = async (req, res, next) => {
  try {
    const { category } = req.params;
    if (req.file) {
      req.body.companyLogo = `/uploads/${req.file.filename}`;
    }
    const settings = await settingService.updateSystemSettings(category, req.body);
    return sendResponse(res, 200, true, `System Settings (${category}) updated`, settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminSettings,
  updateAdminSettings,
  getSupplierSettings,
  updateSupplierSettings,
  getCustomerSettings,
  updateCustomerSettings,
  getSystemSettings,
  updateSystemSettings
};
