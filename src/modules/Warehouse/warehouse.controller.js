const warehouseService = require('./warehouse.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    return sendResponse(res, 200, true, 'Warehouses retrieved successfully', warehouses);
  } catch (error) {
    next(error);
  }
};

const getWarehouseById = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.getWarehouseById(req.params.id);
    return sendResponse(res, 200, true, 'Warehouse retrieved successfully', warehouse);
  } catch (error) {
    if (error.message === 'Warehouse not found') {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.createWarehouse(req.body);
    return sendResponse(res, 201, true, 'Warehouse created successfully', warehouse);
  } catch (error) {
    next(error);
  }
};

const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.updateWarehouse(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Warehouse updated successfully', warehouse);
  } catch (error) {
    if (error.message === 'Warehouse not found') {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

const deleteWarehouse = async (req, res, next) => {
  try {
    await warehouseService.deleteWarehouse(req.params.id);
    return sendResponse(res, 200, true, 'Warehouse deleted successfully');
  } catch (error) {
    if (error.message === 'Warehouse not found') {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

module.exports = {
  getWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
