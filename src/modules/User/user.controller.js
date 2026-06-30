const userService = require('./user.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    return sendResponse(res, 200, true, 'Users retrieved', users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return sendResponse(res, 201, true, 'User created successfully', user);
  } catch (error) {
    if (error.message === 'Email already in use') {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return sendResponse(res, 200, true, 'User deleted');
  } catch (error) {
    if (error.message === 'User not found') {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser
};
