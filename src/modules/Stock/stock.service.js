const { sequelize, StockMovement, Product, ProductVariant } = require('../../models');

const stockIn = async (movementData, externalTransaction = null) => {
  const { variantId, quantity, reference } = movementData;
  
  const transaction = externalTransaction || await sequelize.transaction();
  try {
    const variant = await ProductVariant.findByPk(variantId, { transaction });
    if (!variant) throw new Error('Variant not found');
    
    await variant.update({ warehouseStock: variant.warehouseStock + quantity }, { transaction });
    
    const movement = await StockMovement.create({
      productId: variant.productId,
      type: 'IN',
      quantity,
      reference
    }, { transaction });

    if (!externalTransaction) await transaction.commit();
    return { variant, movement };
  } catch (error) {
    if (!externalTransaction) await transaction.rollback();
    throw error;
  }
};

const stockOut = async (movementData) => {
  const { variantId, quantity, reference } = movementData;
  
  const transaction = await sequelize.transaction();
  try {
    const variant = await ProductVariant.findByPk(variantId, { transaction });
    if (!variant) throw new Error('Variant not found');
    
    if (variant.storeStock < quantity) {
      throw new Error('Insufficient store stock quantity');
    }

    await variant.update({ storeStock: variant.storeStock - quantity }, { transaction });
    
    const movement = await StockMovement.create({
      productId: variant.productId,
      type: 'OUT',
      quantity,
      reference
    }, { transaction });

    await transaction.commit();
    return { variant, movement };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const transferToStore = async (transferData) => {
  const { variantId, quantity, reference } = transferData;
  
  const transaction = await sequelize.transaction();
  try {
    const variant = await ProductVariant.findByPk(variantId, { transaction });
    if (!variant) throw new Error('Variant not found');

    if (variant.warehouseStock < quantity) {
      throw new Error('Insufficient warehouse stock to transfer');
    }

    await variant.update({
      warehouseStock: variant.warehouseStock - quantity,
      storeStock: variant.storeStock + quantity
    }, { transaction });

    const movement = await StockMovement.create({
      productId: variant.productId,
      type: 'TRANSFER',
      quantity,
      reference
    }, { transaction });

    await transaction.commit();
    return { variant, movement };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getStockOverview = async () => {
  return await ProductVariant.findAll({
    include: [{ model: Product, as: 'product', attributes: ['productName', 'sku', 'category'] }]
  });
};

const getLowStockAlerts = async (threshold = 10) => {
  const { Op } = require('sequelize');
  return await ProductVariant.findAll({
    where: { storeStock: { [Op.lt]: threshold } },
    include: [{ model: Product, as: 'product', attributes: ['productName', 'sku', 'category'] }]
  });
};

module.exports = {
  stockIn,
  stockOut,
  transferToStore,
  getStockOverview,
  getLowStockAlerts,
};
