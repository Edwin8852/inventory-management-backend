const Joi = require('joi');

const stockMovementSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  warehouseId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
  reference: Joi.string().optional(),
});

module.exports = {
  stockMovementSchema,
};
