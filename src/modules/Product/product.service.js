const { Product, ProductVariant } = require('../../models');

const variantInclude = { model: ProductVariant, as: 'variants' };

// Normalize status to DB enum values before saving
const normalizeProductData = (data) => {
  if (!data) return data;
  const normalized = { ...data };
  if (normalized.status) {
    const statusMap = {
      'active': 'ACTIVE',
      'inactive': 'INACTIVE',
      'out_of_stock': 'OUT_OF_STOCK',
    };
    normalized.status = statusMap[normalized.status.toLowerCase()] || normalized.status;
  }
  // Convert numeric string fields (from FormData) to numbers
  ['retailPrice', 'wholesalePrice', 'costPrice', 'gstPercentage', 'minOrderQuantity'].forEach(field => {
    if (normalized[field] !== undefined && normalized[field] !== '') {
      normalized[field] = Number(normalized[field]);
    } else if (normalized[field] === '') {
      delete normalized[field];
    }
  });
  return normalized;
};


const getAllProducts = async (whereClause = {}) => {
  return await Product.findAll({ where: whereClause, include: [variantInclude] });
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id, { include: [variantInclude] });
  if (!product) throw new Error('Product not found');
  return product;
};

const createProduct = async (productData) => {
  const normalized = normalizeProductData(productData);
  const existingProduct = await Product.findOne({ where: { sku: normalized.sku } });
  if (existingProduct) throw new Error('Product with this SKU already exists');
  return await Product.create(normalized);
};

const updateProduct = async (id, productData) => {
  const product = await getProductById(id);
  const normalized = normalizeProductData(productData);
  return await product.update(normalized);
};

const deleteProduct = async (id) => {
  const product = await getProductById(id);
  await product.destroy();
  return true;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

