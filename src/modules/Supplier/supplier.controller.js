const supplierService = require('./supplier.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    return sendResponse(res, 200, true, 'Suppliers retrieved successfully', suppliers);
  } catch (error) {
    next(error);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    return sendResponse(res, 200, true, 'Supplier retrieved successfully', supplier);
  } catch (error) {
    if (error.message === 'Supplier not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const getSupplierProfile = async (req, res, next) => {
  try {
    const supplier = await supplierService.getSupplierProfile(req.user.id);
    return sendResponse(res, 200, true, 'Profile retrieved successfully', supplier);
  } catch (error) {
    if (error.message === 'Supplier profile not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    return sendResponse(res, 201, true, 'Supplier created successfully', supplier);
  } catch (error) {
    if (error.message === 'Email is required for the supplier account.' || error.message === 'User already exists with this email.') {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Supplier updated successfully', supplier);
  } catch (error) {
    if (error.message === 'Supplier not found') return sendResponse(res, 404, false, error.message);
    if (error.message === 'Email address is already in use by another user.') return sendResponse(res, 400, false, error.message);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return sendResponse(res, 400, false, 'A record with this information already exists.');
    }
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    return sendResponse(res, 200, true, 'Supplier deleted successfully');
  } catch (error) {
    if (error.message === 'Supplier not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  getSupplierProfile,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
