const { Supplier, User, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');
const { sendSupplierCredentials } = require('../../shared/utils/emailService');

const generateSupplierCode = async () => {
  const count = await Supplier.count();
  return `SUP${String(count + 1).padStart(4, '0')}`;
};

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const getAllSuppliers = async () => {
  return await Supplier.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'isActive'] }]
  });
};

const getSupplierById = async (id) => {
  const supplier = await Supplier.findByPk(id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'isActive'] }]
  });
  if (!supplier) throw new Error('Supplier not found');
  return supplier;
};

const getSupplierProfile = async (userId) => {
  const supplier = await Supplier.findOne({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'isActive'] }]
  });
  if (!supplier) throw new Error('Supplier profile not found');
  return supplier;
};

const createSupplier = async (supplierData, createdByUserId) => {
  const { name, email, companyName, contactPerson, gstNumber, phone, address, panNumber, billingAddress, dispatchAddress, bankName, accountNumber, ifscCode, paymentTerms, creditLimit } = supplierData;

  if (!email) throw new Error('Email is required for the supplier account.');

  // Strictly block if email already registered
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists with this email.');

  const plainPassword = generateRandomPassword();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  const supplierCode = await generateSupplierCode();

  const transaction = await sequelize.transaction();
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'SUPPLIER'
    }, { transaction });

    const supplier = await Supplier.create({
      userId: user.id,
      supplierCode,
      companyName,
      contactPerson,
      gstNumber,
      phone,
      address,
      panNumber,
      billingAddress,
      dispatchAddress,
      bankName,
      accountNumber,
      ifscCode,
      paymentTerms,
      creditLimit: creditLimit || 0,
      status: 'ACTIVE',
    }, { transaction });

    await transaction.commit();

    // Send credentials email (non-blocking — fires after commit)
    sendSupplierCredentials({ name, email, companyName, supplierCode, password: plainPassword });

    return { supplier, supplierCode };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateSupplier = async (id, supplierData) => {
  const supplier = await getSupplierById(id);
  const { name, email, companyName, contactPerson, gstNumber, phone, address, panNumber, billingAddress, dispatchAddress, bankName, accountNumber, ifscCode, paymentTerms, creditLimit, status } = supplierData;

  if (email && supplier.user && email !== supplier.user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('Email address is already in use by another user.');
  }

  const transaction = await sequelize.transaction();
  try {
    if (supplier.user && (name || email)) {
      await supplier.user.update({
        name: name || supplier.user.name,
        email: email || supplier.user.email
      }, { transaction });
    }
    await supplier.update({ companyName, contactPerson, gstNumber, phone, address, panNumber, billingAddress, dispatchAddress, bankName, accountNumber, ifscCode, paymentTerms, creditLimit: creditLimit === '' ? 0 : creditLimit, status }, { transaction });
    await transaction.commit();
    return supplier;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteSupplier = async (id) => {
  const supplier = await getSupplierById(id);
  await supplier.destroy();
  return true;
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  getSupplierProfile,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

