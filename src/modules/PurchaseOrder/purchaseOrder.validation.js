const Joi = require('joi');

const createPOSchema = Joi.object({
  // supplierId is optional here — for SUPPLIER role the controller auto-injects it
  // from their profile. ADMIN must provide it explicitly.
  supplierId: Joi.string().uuid().optional(),
  warehouseId: Joi.string().uuid().required(),
  paymentMethod: Joi.string().valid('Cash', 'UPI', 'CASH').optional(),
  utrNumber: Joi.string().allow(null, '').optional(),
  notes: Joi.string().optional().allow('', null),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().uuid().required(),
      variantId: Joi.string().uuid().optional().allow(null, ''),
      quantity: Joi.number().integer().min(1).required(),
      wholesalePrice: Joi.number().precision(2).required(),
    }).unknown(true)
  ).min(1).required(),
}).unknown(true);

const updatePOStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Draft', 'Approved', 'Processing', 'Delivered', 'Cancelled')
    .required(),
});

module.exports = {
  createPOSchema,
  updatePOStatusSchema,
};
