const Joi = require('joi');

const createOrderSchema = Joi.object({
  customerId: Joi.string().uuid().optional(),
  paymentMethod: Joi.string().valid('Cash', 'UPI', 'CASH').required(),
  utrNumber: Joi.string().allow(null, '').optional(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().uuid().required(),
      variantId: Joi.string().uuid().optional().allow(null, ''),
      quantity: Joi.number().integer().min(1).required(),
      retailPrice: Joi.number().precision(2).required(),
    }).unknown(true)
  ).min(1).required(),
}).unknown(true);

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered').required(),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
