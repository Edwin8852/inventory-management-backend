const { Cart, CartItem, Product, ProductVariant } = require('../../models');

const cartInclude = {
  model: CartItem,
  as: 'items',
  include: [
    {
      model: Product,
      attributes: ['id', 'productName', 'sku', 'image', 'retailPrice', 'wholesalePrice', 'minOrderQuantity', 'status']
    },
    {
      model: ProductVariant,
      as: 'variant',
      attributes: ['id', 'size', 'color', 'storeStock', 'warehouseStock']
    }
  ]
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId }, include: [cartInclude] });
  if (!cart) {
    cart = await Cart.create({ userId });
    cart = await Cart.findByPk(cart.id, { include: [cartInclude] });
  }
  return cart;
};

const getCart = async (userId) => {
  return await getOrCreateCart(userId);
};

const addToCart = async (userId, { productId, variantId, quantity, price, warehouseId }) => {
  const cart = await getOrCreateCart(userId);

  // Check if same product+variant already in cart
  const existing = await CartItem.findOne({
    where: { cartId: cart.id, productId, variantId: variantId || null }
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    const newSubtotal = newQty * parseFloat(price);
    const updateData = { quantity: newQty, subtotal: newSubtotal };
    if (warehouseId) updateData.warehouseId = warehouseId;
    await existing.update(updateData);
  } else {
    const subtotal = quantity * parseFloat(price);
    await CartItem.create({
      cartId: cart.id,
      productId,
      variantId: variantId || null,
      quantity,
      price: parseFloat(price),
      subtotal,
      warehouseId: warehouseId || null,
    });
  }

  return await getOrCreateCart(userId);
};

const updateCartItem = async (userId, cartItemId, { quantity }) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id } });
  if (!item) throw new Error('Cart item not found');

  if (quantity <= 0) {
    await item.destroy();
  } else {
    const subtotal = quantity * parseFloat(item.price);
    await item.update({ quantity, subtotal });
  }

  return await getOrCreateCart(userId);
};

const removeFromCart = async (userId, cartItemId) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: cartItemId, cartId: cart.id } });
  if (!item) throw new Error('Cart item not found');
  await item.destroy();
  return await getOrCreateCart(userId);
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (cart) {
    await CartItem.destroy({ where: { cartId: cart.id } });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
