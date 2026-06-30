const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/responseHandler');
const { Supplier, Customer } = require('../../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, false, 'Access Denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;

    if (decoded.role === 'SUPPLIER') {
      let supplier = await Supplier.findOne({ where: { userId: decoded.id } });
      if (!supplier) {
        supplier = await Supplier.create({ userId: decoded.id, supplierCode: 'SUP' + Math.floor(Math.random()*10000), companyName: decoded.name, status: 'ACTIVE' });
      }
      req.user.supplier = supplier;
    } else if (decoded.role === 'CUSTOMER') {
      let customer = await Customer.findOne({ where: { userId: decoded.id } });
      if (!customer) {
        customer = await Customer.create({ userId: decoded.id });
      }
      req.user.customer = customer;
    }

    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Invalid or expired token.');
  }
};

module.exports = authMiddleware;
