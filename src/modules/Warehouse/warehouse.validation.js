const Joi = require('joi');

const createWarehouseSchema = Joi.object({
  warehouseName: Joi.string().required(),
  location: Joi.string().optional(),
  capacity: Joi.number().integer().min(0).optional(),
  currentStock: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

const updateWarehouseSchema = Joi.object({
  warehouseName: Joi.string().optional(),
  location: Joi.string().optional(),
  capacity: Joi.number().integer().min(0).optional(),
  currentStock: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

module.exports = {
  createWarehouseSchema,
  updateWarehouseSchema,
};
