const { AdminSettings, SupplierSettings, CustomerSettings, SystemSetting } = require('../../models');

const getAdminSettings = async () => {
  let setting = await AdminSettings.findOne();
  if (!setting) {
    setting = await AdminSettings.create({});
  }
  return setting;
};

const updateAdminSettings = async (data) => {
  let setting = await AdminSettings.findOne();
  if (!setting) {
    setting = await AdminSettings.create(data);
  } else {
    await setting.update(data);
  }
  return setting;
};

const getSupplierSettings = async (supplierId) => {
  let setting = await SupplierSettings.findOne({ where: { supplierId } });
  const { Supplier, User } = require('../../models');
  const supplier = await Supplier.findByPk(supplierId, { include: [{ model: User, as: 'user' }] });

  if (!setting) {
    setting = await SupplierSettings.create({ 
      supplierId,
      businessName: supplier?.companyName || '',
      gstNumber: supplier?.gstNumber || '',
      address: supplier?.address || '',
      phoneNumber: supplier?.phone || '',
      email: supplier?.user?.email || '',
      bankDetails: supplier?.bankName ? `${supplier.bankName} - ${supplier.accountNumber} - ${supplier.ifscCode}` : ''
    });
  } else if (!setting.businessName && supplier) {
    await setting.update({
      businessName: supplier.companyName || '',
      gstNumber: supplier.gstNumber || '',
      address: supplier.address || '',
      phoneNumber: supplier.phone || '',
      email: supplier.user?.email || '',
      bankDetails: supplier.bankName ? `${supplier.bankName} - ${supplier.accountNumber} - ${supplier.ifscCode}` : ''
    });
  }
  return setting;
};

const updateSupplierSettings = async (supplierId, data) => {
  let setting = await SupplierSettings.findOne({ where: { supplierId } });
  if (!setting) {
    setting = await SupplierSettings.create({ supplierId, ...data });
  } else {
    await setting.update(data);
  }
  return setting;
};

const getCustomerSettings = async (customerId) => {
  let setting = await CustomerSettings.findOne({ where: { customerId } });
  const { Customer, User } = require('../../models');
  const customer = await Customer.findByPk(customerId, { include: [{ model: User, as: 'user' }] });

  if (!setting) {
    setting = await CustomerSettings.create({ 
      customerId,
      deliveryAddress: customer?.address || '',
      phoneNumber: customer?.phone || '',
      email: customer?.user?.email || ''
    });
  } else if (!setting.deliveryAddress && customer) {
    await setting.update({
      deliveryAddress: customer.address || '',
      phoneNumber: customer.phone || '',
      email: customer.user?.email || ''
    });
  }
  return setting;
};

const updateCustomerSettings = async (customerId, data) => {
  let setting = await CustomerSettings.findOne({ where: { customerId } });
  if (!setting) {
    setting = await CustomerSettings.create({ customerId, ...data });
  } else {
    await setting.update(data);
  }
  return setting;
};

const getSystemSettings = async (category) => {
  const [setting] = await SystemSetting.findOrCreate({
    where: { category },
    defaults: { category, configData: {} }
  });
  return setting.configData;
};

const updateSystemSettings = async (category, data) => {
  const [setting] = await SystemSetting.findOrCreate({
    where: { category },
    defaults: { category, configData: data }
  });
  
  // If it already existed and we need to merge
  const newConfigData = { ...setting.configData, ...data };
  await setting.update({ configData: newConfigData });
  
  return setting.configData;
};

module.exports = {
  getAdminSettings,
  updateAdminSettings,
  getSupplierSettings,
  updateSupplierSettings,
  getCustomerSettings,
  updateCustomerSettings,
  getSystemSettings,
  updateSystemSettings
};
