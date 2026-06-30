const Joi = require('joi');

// FormData sends all values as strings, so we allow string or number for price fields
// and convert them. Joi's convert:true (default) handles "850" -> 850 automatically.

const createProductSchema = Joi.object({
  productName: Joi.string().required(),
  sku: Joi.string().required(),
  category: Joi.string().optional().allow(''),
  brand: Joi.string().optional().allow(''),
  description: Joi.string().optional().allow(''),
  retailPrice: Joi.number().precision(2).required(),
  wholesalePrice: Joi.number().precision(2).required(),
  costPrice: Joi.number().precision(2).optional().allow('', null),
  gstPercentage: Joi.number().precision(2).optional().allow('', null),
  minOrderQuantity: Joi.number().integer().min(1).optional().allow('', null),
  image: Joi.string().optional().allow('', null),
  // Accept both frontend-style ('Active') and DB-style ('ACTIVE') values
  status: Joi.string()
    .valid('Active', 'Inactive', 'Out_of_Stock', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK')
    .optional()
    .allow('', null),
});

const updateProductSchema = Joi.object({
  productName: Joi.string().optional(),
  sku: Joi.string().optional(),
  category: Joi.string().optional().allow(''),
  brand: Joi.string().optional().allow(''),
  description: Joi.string().optional().allow(''),
  retailPrice: Joi.number().precision(2).optional(),
  wholesalePrice: Joi.number().precision(2).optional(),
  costPrice: Joi.number().precision(2).optional().allow('', null),
  gstPercentage: Joi.number().precision(2).optional().allow('', null),
  minOrderQuantity: Joi.number().integer().min(1).optional().allow('', null),
  image: Joi.string().optional().allow('', null),
  status: Joi.string()
    .valid('Active', 'Inactive', 'Out_of_Stock', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK')
    .optional()
    .allow('', null),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
