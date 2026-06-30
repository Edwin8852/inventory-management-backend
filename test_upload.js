const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    // 1. Get a token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'password123'
    });
    const token = loginRes.data.data.token;

    // 2. Get products
    const prodRes = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const product = prodRes.data.data[0];

    // 3. Update product with multipart
    const form = new FormData();
    form.append('productName', product.productName + ' (Updated)');
    
    // Test what happens when we set Content-Type to multipart/form-data manually
    const updateRes = await axios.put(`http://localhost:5000/api/products/${product.id}`, form, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // Axios 1.x should handle this
      }
    });
    console.log('Update Success:', updateRes.data);
  } catch (err) {
    console.error('Update Error:', err.response ? err.response.data : err.message);
  }
}

testUpload();
