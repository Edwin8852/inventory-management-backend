const Joi = require('joi');

const recordPaymentSchema = Joi.object({
  invoiceId: Joi.string().uuid().required(),
  paymentMethod: Joi.string().valid('Cash', 'UPI', 'Card', 'Bank Transfer').required(),
  amount: Joi.number().precision(2).required(),
  transactionId: Joi.string().optional(),
});

module.exports = {
  recordPaymentSchema,
};
