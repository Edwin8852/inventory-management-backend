const { User } = require('../../models');
const bcrypt = require('bcryptjs');

const getUsers = async () => {
  return await User.findAll({ attributes: { exclude: ['password'] } });
};

const createUser = async (data) => {
  const { name, email, password, role } = data;
  
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'STAFF'
  });

  const userJson = user.toJSON();
  delete userJson.password;
  return userJson;
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.destroy();
};

module.exports = {
  getUsers,
  createUser,
  deleteUser
};
