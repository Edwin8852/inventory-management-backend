const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Customer, sequelize } = require('../../models');

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (!user.isActive) {
    throw new Error('User account is disabled.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { token, user: payload };
};

const registerCustomer = async (customerData) => {
  const { name, email, password, phone, address } = customerData;

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists with this email.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const transaction = await sequelize.transaction();
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'CUSTOMER',
    }, { transaction });

    const customer = await Customer.create({
      userId: user.id,
      phone: phone || null,
      address: address || null,
    }, { transaction });

    await transaction.commit();

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { token, user: payload };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const registerAdmin = async (adminData) => {
  const { name, email, password } = adminData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAdmin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'ADMIN',
  });

  return newAdmin;
};

const handleGoogleCallback = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { token, user: payload };
};

module.exports = {
  loginUser,
  registerCustomer,
  registerAdmin,
  handleGoogleCallback,
};

