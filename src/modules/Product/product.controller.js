const productService = require('./product.service');
const { sendResponse } = require('../../shared/utils/responseHandler');
const { ProductVariant } = require('../../models');
const { Op } = require('sequelize');

const getProducts = async (req, res, next) => {
  try {
    let whereClause = {};
    const role = req.user.role;
    
    if (role === 'SUPPLIER' && req.user.supplier && req.user.supplier.id) {
      whereClause = {
        [Op.or]: [
          { supplierId: req.user.supplier.id },
          { supplierId: null }
        ]
      };
    }

    const products = await productService.getAllProducts(whereClause);

    const transformedProducts = products.map(p => {
      let product = p.toJSON();
      if (role === 'CUSTOMER') {
        delete product.wholesalePrice;
        delete product.costPrice;
      } else if (role === 'SUPPLIER') {
        delete product.retailPrice;
        delete product.costPrice;
      }
      return product;
    });

    return sendResponse(res, 200, true, 'Products retrieved successfully', transformedProducts);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    let pJson = product.toJSON();
    if (req.user.role === 'CUSTOMER') {
      delete pJson.wholesalePrice;
      delete pJson.costPrice;
    } else if (req.user.role === 'SUPPLIER') {
      delete pJson.retailPrice;
      delete pJson.costPrice;
    }
    return sendResponse(res, 200, true, 'Product retrieved successfully', pJson);
  } catch (error) {
    if (error.message === 'Product not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    if (req.file) req.body.image = '/uploads/' + req.file.filename;
    
    // Auto-assign supplierId if created by a supplier
    if (req.user.role === 'SUPPLIER' && req.user.supplier) {
      req.body.supplierId = req.user.supplier.id;
    }
    
    const product = await productService.createProduct(req.body);
    return sendResponse(res, 201, true, 'Product created successfully', product);
  } catch (error) {
    if (error.message === 'Product with this SKU already exists') return sendResponse(res, 400, false, error.message);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (req.file) req.body.image = '/uploads/' + req.file.filename;
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Product updated successfully', product);
  } catch (error) {
    if (error.message === 'Product not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return sendResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    if (error.message === 'Product not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

// ── Variant Controllers ────────────────────────────────────────────────────────

const createVariant = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { size, color, sku, warehouseStock, storeStock } = req.body;

    if (!size || !color) return sendResponse(res, 400, false, 'Size and color are required for a variant.');

    const variantSku = sku || `${productId.slice(0, 4)}-${size}-${color}`.toUpperCase();

    const variant = await ProductVariant.create({
      productId,
      size,
      color,
      sku: variantSku,
      warehouseStock: Number(warehouseStock) || 0,
      storeStock: Number(storeStock) || 0,
    });

    return sendResponse(res, 201, true, 'Variant created successfully', variant);
  } catch (error) {
    next(error);
  }
};

const updateVariant = async (req, res, next) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.variantId);
    if (!variant) return sendResponse(res, 404, false, 'Variant not found');

    const { size, color, sku, warehouseStock, storeStock } = req.body;
    await variant.update({
      size: size ?? variant.size,
      color: color ?? variant.color,
      sku: sku ?? variant.sku,
      warehouseStock: warehouseStock !== undefined ? Number(warehouseStock) : variant.warehouseStock,
      storeStock: storeStock !== undefined ? Number(storeStock) : variant.storeStock,
    });

    return sendResponse(res, 200, true, 'Variant updated successfully', variant);
  } catch (error) {
    next(error);
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.variantId);
    if (!variant) return sendResponse(res, 404, false, 'Variant not found');
    await variant.destroy();
    return sendResponse(res, 200, true, 'Variant deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
};

