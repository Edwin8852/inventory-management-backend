const customerService = require('./customer.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();
    return sendResponse(res, 200, true, 'Customers retrieved successfully', customers);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    return sendResponse(res, 200, true, 'Customer retrieved successfully', customer);
  } catch (error) {
    if (error.message === 'Customer not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const getCustomerProfile = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerProfile(req.user.id);
    return sendResponse(res, 200, true, 'Profile retrieved successfully', customer);
  } catch (error) {
    if (error.message === 'Customer profile not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    return sendResponse(res, 201, true, 'Customer created successfully', customer);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Customer updated successfully', customer);
  } catch (error) {
    if (error.message === 'Customer not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    return sendResponse(res, 200, true, 'Customer deleted successfully');
  } catch (error) {
    if (error.message === 'Customer not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const getOrderHistory = async (req, res, next) => {
  try {
    const history = await customerService.getOrderHistory(req.user.id);
    return sendResponse(res, 200, true, 'Order history retrieved successfully', history);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  getCustomerProfile,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getOrderHistory,
};
