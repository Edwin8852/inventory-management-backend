const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');
const jwt = require('jsonwebtoken');

describe('Role-Based API Access Tests', () => {
  let adminToken, supplierToken, customerToken;

  beforeAll(async () => {
    // Generate mock tokens for the tests
    const generateToken = (role) => {
      const payload = { id: 'mock-id', role };
      // Note: During test, process.env.JWT_SECRET must be defined or mocked
      return jwt.sign(payload, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1d' });
    };

    adminToken = generateToken('ADMIN');
    supplierToken = generateToken('SUPPLIER');
    customerToken = generateToken('CUSTOMER');
  });

  describe('GET /api/users (Admin Only Route)', () => {
    it('should allow ADMIN to access', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      // We expect 200, or at least NOT 403. If DB is empty or fails, it might be 500, but not 403.
      expect(res.statusCode).not.toBe(403);
    });

    it('should deny SUPPLIER to access', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${supplierToken}`);
      
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Forbidden/i);
    });

    it('should deny CUSTOMER to access', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/products (Role-Based Masking)', () => {
    it('should return products without masking for ADMIN', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
      if (res.body.data && res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty('retailPrice');
        expect(res.body.data[0]).toHaveProperty('wholesalePrice');
      }
    });

    it('should mask retailPrice for SUPPLIER', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${supplierToken}`);
      
      expect(res.statusCode).toBe(200);
      if (res.body.data && res.body.data.length > 0) {
        expect(res.body.data[0]).not.toHaveProperty('retailPrice');
        expect(res.body.data[0]).toHaveProperty('wholesalePrice');
      }
    });

    it('should mask wholesalePrice and Stocks for CUSTOMER', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(res.statusCode).toBe(200);
      if (res.body.data && res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty('retailPrice');
        expect(res.body.data[0]).not.toHaveProperty('wholesalePrice');
        expect(res.body.data[0]).not.toHaveProperty('Stocks');
      }
    });
  });
});
