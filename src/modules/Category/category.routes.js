const express = require('express');
const categoryController = require('./category.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', categoryController.getCategories);
router.post('/', roleMiddleware(['ADMIN']), categoryController.createCategory);
router.put('/:id', roleMiddleware(['ADMIN']), categoryController.updateCategory);
router.delete('/:id', roleMiddleware(['ADMIN']), categoryController.deleteCategory);

module.exports = router;
