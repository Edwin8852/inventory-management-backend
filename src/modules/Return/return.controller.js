const returnService = require('./return.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const processReturn = async (req, res, next) => {
  try {
    const returnRecord = await returnService.processReturn(req.body);
    return sendResponse(res, 201, true, 'Return processed successfully', returnRecord);
  } catch (error) {
    next(error);
  }
};

const getReturns = async (req, res, next) => {
  try {
    const returns = await returnService.getReturns();
    return sendResponse(res, 200, true, 'Returns retrieved successfully', returns);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processReturn,
  getReturns
};
