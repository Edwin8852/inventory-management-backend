const { sendResponse } = require('../utils/responseHandler');

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errorMessages
      });
    }
    
    // Replace req.body with validated value (applies defaults, type casting, etc)
    req.body = value;
    next();
  };
};

module.exports = validationMiddleware;

