const Joi = require('joi');

const generateInvoiceSchema = Joi.object({
  referenceId: Joi.string().uuid().required(),
  type: Joi.string().valid('CUSTOMER', 'SUPPLIER').required(),
});

module.exports = {
  generateInvoiceSchema,
};
