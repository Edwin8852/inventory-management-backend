const Joi = require('joi');

const createCustomerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  address: Joi.string().optional().allow(''),
  gstNumber: Joi.string().optional().allow(''),
  panNumber: Joi.string().optional().allow(null, ''),
  billingAddress: Joi.string().optional().allow(null, ''),
  dispatchAddress: Joi.string().optional().allow(null, ''),
  bankName: Joi.string().optional().allow(null, ''),
  accountNumber: Joi.string().optional().allow(null, ''),
  ifscCode: Joi.string().optional().allow(null, ''),
  paymentTerms: Joi.string().optional().allow(null, ''),
  creditLimit: Joi.number().optional().allow(null),
});

const updateCustomerSchema = Joi.object({
  name: Joi.string().optional().allow(''),
  email: Joi.string().email().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  address: Joi.string().optional().allow(''),
  gstNumber: Joi.string().optional().allow(''),
  panNumber: Joi.string().optional().allow(null, ''),
  billingAddress: Joi.string().optional().allow(null, ''),
  dispatchAddress: Joi.string().optional().allow(null, ''),
  bankName: Joi.string().optional().allow(null, ''),
  accountNumber: Joi.string().optional().allow(null, ''),
  ifscCode: Joi.string().optional().allow(null, ''),
  paymentTerms: Joi.string().optional().allow(null, ''),
  creditLimit: Joi.number().optional().allow(null),
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
};
