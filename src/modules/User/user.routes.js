const express = require('express');
const userController = require('./user.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['ADMIN']), userController.getUsers);
router.post('/', roleMiddleware(['ADMIN']), userController.createUser);
router.delete('/:id', roleMiddleware(['ADMIN']), userController.deleteUser);

module.exports = router;
