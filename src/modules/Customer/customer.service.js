const { Customer, User, sequelize } = require('../../models');

const getAllCustomers = async () => {
  return await Customer.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'isActive'] }]
  });
};

const getCustomerById = async (id) => {
  const customer = await Customer.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'isActive'] }]
  });
  if (!customer) throw new Error('Customer not found');
  return customer;
};

const getCustomerProfile = async (userId) => {
  const customer = await Customer.findOne({ where: { userId } });
  if (!customer) throw new Error('Customer profile not found');
  return customer;
};

const createCustomer = async (customerData) => {
  const { name, email, phone, address, gstNumber } = customerData;
  const transaction = await sequelize.transaction();

  try {
    // Generate a default/dummy email if none is provided since User requires an email
    const emailToUse = email || `customer_${Date.now()}@domain.local`;
    
    // Check if user already exists
    let user = await User.findOne({ where: { email: emailToUse } });
    if (!user) {
      user = await User.create({
        name: name || 'Unknown Customer',
        email: emailToUse,
        password: 'Customer@123', // Dummy password for now
        role: 'CUSTOMER'
      }, { transaction });
    }

    const customer = await Customer.create({
      userId: user.id,
      phone,
      address,
      gstNumber
    }, { transaction });

    await transaction.commit();
    return customer;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateCustomer = async (id, customerData) => {
  const customer = await getCustomerById(id);
  const { name, email, phone, address, gstNumber } = customerData;

  const transaction = await sequelize.transaction();
  try {
    if (customer.user) {
      await customer.user.update({
        name: name || customer.user.name,
        email: email || customer.user.email
      }, { transaction });
    }
    
    await customer.update({
      phone,
      address,
      gstNumber
    }, { transaction });

    await transaction.commit();
    return customer;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteCustomer = async (id) => {
  const customer = await getCustomerById(id);
  await customer.destroy();
  return true;
};

const getOrderHistory = async (userId) => {
  // Placeholder for order history. To be implemented in Phase 3
  return [];
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerProfile,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getOrderHistory,
};
