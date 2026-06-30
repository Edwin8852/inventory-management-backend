const { sendResponse } = require('../utils/responseHandler');

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(res, 403, false, 'Access Denied');
    }
    next();
  };
};

module.exports = roleMiddleware;
