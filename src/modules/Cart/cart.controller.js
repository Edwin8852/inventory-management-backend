const cartService = require('./cart.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    return sendResponse(res, 200, true, 'Cart retrieved', cart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(req.user.id, req.body);
    return sendResponse(res, 200, true, 'Item added to cart', cart);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItem(req.user.id, req.params.itemId, req.body);
    return sendResponse(res, 200, true, 'Cart updated', cart);
  } catch (error) {
    if (error.message === 'Cart item not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(req.user.id, req.params.itemId);
    return sendResponse(res, 200, true, 'Item removed from cart', cart);
  } catch (error) {
    if (error.message === 'Cart item not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id);
    return sendResponse(res, 200, true, 'Cart cleared');
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
