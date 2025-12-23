const axios = require('axios');

const API_BASE = 'http://localhost:4000';

async function testLogin() {
  try {
    console.log('🔍 Testing backend API...');
    
    // Test 1: Login
    console.log('\n1️⃣ Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@erp.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    console.log('Response:', loginResponse.data);
    
    const { accessToken, refreshToken } = loginResponse.data.data;
    console.log('\nAccess Token:', accessToken);
    
    // Test 2: Get /me with token
    console.log('\n2️⃣ Testing /me endpoint...');
    const meResponse = await axios.get(`${API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ /me successful');
    console.log('User data:', meResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testLogin();
