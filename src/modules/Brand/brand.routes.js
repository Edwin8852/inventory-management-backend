const express = require('express');
const brandController = require('./brand.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', brandController.getBrands);
router.post('/', roleMiddleware(['ADMIN']), brandController.createBrand);
router.put('/:id', roleMiddleware(['ADMIN']), brandController.updateBrand);
router.delete('/:id', roleMiddleware(['ADMIN']), brandController.deleteBrand);

module.exports = router;
