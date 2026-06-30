const express = require('express');
const passport = require('passport');
const authController = require('./auth.controller');
const validationMiddleware = require('../../shared/middleware/validationMiddleware');
const { loginSchema, registerSchema } = require('./auth.validation');

const router = express.Router();

router.post('/register', authController.registerCustomer);
router.post('/login', validationMiddleware(loginSchema), authController.login);

// Setup an admin directly for initial configuration
router.post('/setup-admin', validationMiddleware(registerSchema), authController.createAdmin);

// Google OAuth endpoints
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/login-failed' }),
  authController.googleCallback
);

router.get('/login-failed', (req, res) => {
  res.status(401).json({ success: false, message: 'Google Authentication failed' });
});

module.exports = router;
