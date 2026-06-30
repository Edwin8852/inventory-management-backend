const { Brand } = require('../../models');
const { sendResponse } = require('../../shared/utils/responseHandler');

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll();
    return sendResponse(res, 200, true, 'Brands fetched successfully', brands);
  } catch (error) { next(error); }
};

exports.createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    return sendResponse(res, 201, true, 'Brand created', brand);
  } catch (error) { next(error); }
};

exports.updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return sendResponse(res, 404, false, 'Brand not found');
    await brand.update(req.body);
    return sendResponse(res, 200, true, 'Brand updated', brand);
  } catch (error) { next(error); }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return sendResponse(res, 404, false, 'Brand not found');
    await brand.destroy();
    return sendResponse(res, 200, true, 'Brand deleted');
  } catch (error) { next(error); }
};
