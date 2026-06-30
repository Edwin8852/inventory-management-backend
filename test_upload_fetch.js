const fs = require('fs');

async function testUpload() {
  try {
    // 1. Get a token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;

    // 2. Get products
    const prodRes = await fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const prodData = await prodRes.json();
    const product = prodData.data[0];
    
    console.log('Original Product:', product.productName, product.image);

    // 3. Update product with multipart
    const formData = new FormData();
    formData.append('productName', product.productName + ' (Updated)');
    // we won't even append an image just check if it survives without throwing an error
    
    const updateRes = await fetch(`http://localhost:5000/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    const updateData = await updateRes.json();
    console.log('Update Success:', updateData);
  } catch (err) {
    console.error('Update Error:', err);
  }
}

testUpload();
