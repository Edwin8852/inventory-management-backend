const Joi = require('joi');

const createSupplierSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  contactPerson: Joi.string().optional().allow(null, ''),
  companyName: Joi.string().required(),
  gstNumber: Joi.string().optional().allow(null, ''),
  panNumber: Joi.string().optional().allow(null, ''),
  phone: Joi.string().optional().allow(null, ''),
  address: Joi.string().optional().allow(null, ''),
  billingAddress: Joi.string().optional().allow(null, ''),
  dispatchAddress: Joi.string().optional().allow(null, ''),
  bankName: Joi.string().optional().allow(null, ''),
  accountNumber: Joi.string().optional().allow(null, ''),
  ifscCode: Joi.string().optional().allow(null, ''),
  paymentTerms: Joi.string().optional().allow(null, ''),
  creditLimit: Joi.any().optional(),
});

const updateSupplierSchema = Joi.object({
  name: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  contactPerson: Joi.string().optional().allow(null, ''),
  companyName: Joi.string().optional().allow(null, ''),
  gstNumber: Joi.string().optional().allow(null, ''),
  panNumber: Joi.string().optional().allow(null, ''),
  phone: Joi.string().optional().allow(null, ''),
  address: Joi.string().optional().allow(null, ''),
  billingAddress: Joi.string().optional().allow(null, ''),
  dispatchAddress: Joi.string().optional().allow(null, ''),
  bankName: Joi.string().optional().allow(null, ''),
  accountNumber: Joi.string().optional().allow(null, ''),
  ifscCode: Joi.string().optional().allow(null, ''),
  paymentTerms: Joi.string().optional().allow(null, ''),
  creditLimit: Joi.any().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

module.exports = {
  createSupplierSchema,
  updateSupplierSchema,
};
