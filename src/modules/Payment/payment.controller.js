const paymentService = require('./payment.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const recordPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.recordPayment(req.body);
    return sendResponse(res, 201, true, 'Payment recorded successfully', payment);
  } catch (error) {
    if (['Invoice not found', 'Payment amount exceeds invoice total amount'].includes(error.message)) {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getPayments();
    return sendResponse(res, 200, true, 'Payments retrieved successfully', payments);
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    return sendResponse(res, 200, true, 'Payment retrieved successfully', payment);
  } catch (error) {
    if (error.message === 'Payment not found') return sendResponse(res, 404, false, error.message);
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { status } = req.body; // 'PAID' or 'FAILED'
    const payment = await paymentService.verifyPayment(req.params.id, status, req.user.id);
    return sendResponse(res, 200, true, 'Payment verified successfully', payment);
  } catch (error) {
    if (['Payment not found', 'Payment is not pending verification'].includes(error.message)) {
      return sendResponse(res, 400, false, error.message);
    }
    next(error);
  }
};

module.exports = {
  recordPayment,
  getPayments,
  getPaymentById,
  verifyPayment,
};
