const { Category } = require('../../models');
const { sendResponse } = require('../../shared/utils/responseHandler');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    return sendResponse(res, 200, true, 'Categories fetched successfully', categories);
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return sendResponse(res, 201, true, 'Category created', category);
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendResponse(res, 404, false, 'Category not found');
    await category.update(req.body);
    return sendResponse(res, 200, true, 'Category updated', category);
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendResponse(res, 404, false, 'Category not found');
    await category.destroy();
    return sendResponse(res, 200, true, 'Category deleted');
  } catch (error) { next(error); }
};
