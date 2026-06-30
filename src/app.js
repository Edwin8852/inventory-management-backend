const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());

const errorHandler = require('./shared/middleware/errorHandler');

// Serve static uploads
app.use('/uploads', express.static('uploads'));

// Health check API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Billing API Running'
  });
});

// Module routes will be mounted here
app.use('/api', require('./routes'));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
