const invoiceService = require('./invoice.service');
const { sendResponse } = require('../../shared/utils/responseHandler');

const getInvoices = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.invoiceType) filters.invoiceType = req.query.invoiceType;
    if (req.query.status) filters.status = req.query.status;
    
    // Pass req.user to service for RBAC
    const invoices = await invoiceService.getInvoices(req.user, filters);
    return sendResponse(res, 200, true, 'Invoices retrieved successfully', invoices);
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id, req.user);
    return sendResponse(res, 200, true, 'Invoice retrieved successfully', invoice);
  } catch (error) {
    if (error.message === 'Invoice not found') return sendResponse(res, 404, false, error.message);
    if (error.message === 'Access denied') return sendResponse(res, 403, false, 'You do not have permission to view this invoice');
    next(error);
  }
};

const triggerInvoiceGeneration = async (req, res, next) => {
  try {
    const { type, referenceId } = req.body;
    // Assuming only Admin can manually trigger invoice generation for now
    if (req.user.role !== 'ADMIN') {
      return sendResponse(res, 403, false, 'Only admins can trigger invoice generation');
    }
    
    let invoice;
    if (type === 'CUSTOMER') {
      invoice = await invoiceService.generateCustomerInvoice(referenceId);
    } else if (type === 'SUPPLIER') {
      invoice = await invoiceService.generateSupplierInvoice(referenceId);
    } else {
      return sendResponse(res, 400, false, 'Invalid invoice type');
    }
    return sendResponse(res, 201, true, 'Invoice generation triggered', invoice);
  } catch (error) {
    if (['Order not found', 'Purchase Order not found'].includes(error.message)) {
      return sendResponse(res, 404, false, error.message);
    }
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  triggerInvoiceGeneration,
};
