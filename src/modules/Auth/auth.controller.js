const authService = require('./auth.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const registerCustomer = async (req, res, next) => {
  try {
    const result = await authService.registerCustomer(req.body);
    return sendResponse(res, 201, true, 'Registration successful', result);
  } catch (error) {
    if (error.message === 'User already exists with this email.') {
      return sendResponse(res, 400, false, error.message);
    }
    if (error.message === 'Name, email, and password are required.') {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendResponse(res, 200, true, 'Login successful', result);
  } catch (error) {
    if (error.message === 'Invalid email or password.' || error.message === 'User account is disabled.') {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const googleCallback = (req, res, next) => {
  try {
    const result = authService.handleGoogleCallback(req.user);
    // Return token directly for now. Can be replaced with a redirect if rendering an SPA.
    return sendResponse(res, 200, true, 'Google login successful', result);
  } catch (error) {
    next(error);
  }
};

// Helper function to create initial admin
const createAdmin = async (req, res, next) => {
  try {
    const admin = await authService.registerAdmin(req.body);
    return sendResponse(res, 201, true, 'Admin created successfully', { id: admin.id, email: admin.email });
  } catch (error) {
    if (error.message === 'User already exists with this email.') {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

module.exports = {
  registerCustomer,
  login,
  googleCallback,
  createAdmin,
};
