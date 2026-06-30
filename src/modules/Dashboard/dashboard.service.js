const { Product, Customer, Supplier, Order, PurchaseOrder, Payment, Invoice, ProductVariant } = require('../../models');
const { Op } = require('sequelize');

const getAdminDashboard = async () => {
  const totalProducts = await Product.count();
  const totalCustomers = await Customer.count();
  const totalSuppliers = await Supplier.count();
  const totalOrders = await Order.count();
  const totalRevenue = await Order.sum('totalAmount', { where: { status: 'Delivered' } }) || 0;
  
  const lowStockProducts = await ProductVariant.count({
    where: { storeStock: { [Op.lt]: 10 } }
  });

  return {
    totalProducts,
    totalCustomers,
    totalSuppliers,
    totalOrders,
    totalRevenue,
    lowStockProducts,
  };
};

const getSupplierDashboard = async (userId) => {
  const supplier = await Supplier.findOne({ where: { userId } });
  if (!supplier) throw new Error('Supplier not found');

  const totalPOs = await PurchaseOrder.count({ where: { supplierId: supplier.id } });
  
  const pos = await PurchaseOrder.findAll({ where: { supplierId: supplier.id }, attributes: ['id'] });
  const poIds = pos.map(p => p.id);

  const invoices = await Invoice.findAll({ where: { invoiceType: 'SUPPLIER', orderId: { [Op.in]: poIds } } });
  let totalInvoiceAmount = 0;
  invoices.forEach(inv => totalInvoiceAmount += parseFloat(inv.totalAmount));

  const invoiceIds = invoices.map(i => i.id);
  const totalPaidAmount = await Payment.sum('amount', { where: { invoiceId: { [Op.in]: invoiceIds }, status: 'Paid' } }) || 0;

  const pendingPayments = totalInvoiceAmount - totalPaidAmount;

  return {
    totalPOs,
    totalInvoiceAmount,
    totalPaidAmount,
    pendingPayments,
  };
};

const getCustomerDashboard = async (userId) => {
  const customer = await Customer.findOne({ where: { userId } });
  if (!customer) throw new Error('Customer not found');

  const totalOrders = await Order.count({ where: { customerId: customer.id } });

  const orders = await Order.findAll({ where: { customerId: customer.id }, attributes: ['id'] });
  const orderIds = orders.map(o => o.id);

  const invoices = await Invoice.findAll({ where: { invoiceType: 'CUSTOMER', orderId: { [Op.in]: orderIds } } });
  let totalInvoiceAmount = 0;
  invoices.forEach(inv => totalInvoiceAmount += parseFloat(inv.totalAmount));

  const invoiceIds = invoices.map(i => i.id);
  const totalPaidAmount = await Payment.sum('amount', { where: { invoiceId: { [Op.in]: invoiceIds }, status: 'Paid' } }) || 0;

  const pendingPayments = totalInvoiceAmount - totalPaidAmount;

  return {
    totalOrders,
    totalInvoiceAmount,
    totalPaidAmount,
    pendingPayments,
  };
};

module.exports = {
  getAdminDashboard,
  getSupplierDashboard,
  getCustomerDashboard,
};
