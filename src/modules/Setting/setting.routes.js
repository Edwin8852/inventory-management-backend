const express = require('express');
const settingController = require('./setting.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const upload = require('../../shared/middleware/uploadMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/admin', roleMiddleware(['ADMIN']), settingController.getAdminSettings);
router.put('/admin', roleMiddleware(['ADMIN']), upload.single('companyLogo'), settingController.updateAdminSettings);

router.get('/supplier', roleMiddleware(['SUPPLIER']), settingController.getSupplierSettings);
router.put('/supplier', roleMiddleware(['SUPPLIER']), settingController.updateSupplierSettings);

router.get('/customer', roleMiddleware(['CUSTOMER']), settingController.getCustomerSettings);
router.put('/customer', roleMiddleware(['CUSTOMER']), settingController.updateCustomerSettings);

// System settings: Allow 'company' read for everyone, otherwise require ADMIN
router.get('/system/:category', (req, res, next) => {
  if (req.params.category === 'company') {
    return next();
  }
  return roleMiddleware(['ADMIN'])(req, res, next);
}, settingController.getSystemSettings);

router.put('/system/:category', roleMiddleware(['ADMIN']), upload.single('companyLogo'), settingController.updateSystemSettings);

module.exports = router;
