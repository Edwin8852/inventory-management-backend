const express = require('express');
const returnController = require('./return.controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const roleMiddleware = require('../../shared/middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['ADMIN']), returnController.getReturns);
router.post('/', roleMiddleware(['ADMIN']), returnController.processReturn);

module.exports = router;
