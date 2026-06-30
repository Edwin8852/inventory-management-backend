const { Warehouse } = require('../../models');

const getAllWarehouses = async () => {
  return await Warehouse.findAll();
};

const getWarehouseById = async (id) => {
  const warehouse = await Warehouse.findByPk(id);
  if (!warehouse) {
    throw new Error('Warehouse not found');
  }
  return warehouse;
};

const createWarehouse = async (warehouseData) => {
  return await Warehouse.create(warehouseData);
};

const updateWarehouse = async (id, warehouseData) => {
  const warehouse = await getWarehouseById(id);
  return await warehouse.update(warehouseData);
};

const deleteWarehouse = async (id) => {
  const warehouse = await getWarehouseById(id);
  await warehouse.destroy();
  return true;
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
