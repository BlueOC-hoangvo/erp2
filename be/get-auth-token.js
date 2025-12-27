/**
 * Get valid auth token for BOM API testing
 */
const axios = require('axios');

const API_BASE = 'http://localhost:4000';

async function getAuthToken() {
  try {
    console.log('🔐 Getting authentication token...');
    
    // Login with default credentials
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@erp.local',
      password: 'Admin@123'
    });
    
    if (loginResponse.data && loginResponse.data.accessToken) {
      const token = loginResponse.data.accessToken;
      console.log('✅ Successfully obtained auth token');
      console.log('Token:', token.substring(0, 50) + '...');
      return token;
    } else {
      console.log('❌ Failed to get token from login response');
      console.log('Response:', loginResponse.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Login failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    return null;
  }
}

// Test if token works
async function testToken(token) {
  try {
    console.log('🧪 Testing token with protected endpoint...');
    
    const response = await axios.get(`${API_BASE}/boms/templates`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Token works! Protected endpoint accessible');
    return true;
  } catch (error) {
    console.log('❌ Token test failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    return false;
  }
}

// Main function
async function main() {
  const token = await getAuthToken();
  
  if (token) {
    const works = await testToken(token);
    if (works) {
      console.log('\n📋 AUTH TOKEN FOR TESTING:');
      console.log('Bearer ' + token);
      
      // Save token to file for other scripts
      const fs = require('fs');
      fs.writeFileSync('test-results/auth-token.txt', 'Bearer ' + token);
      console.log('📄 Token saved to test-results/auth-token.txt');
    }
  } else {
    console.log('❌ Could not obtain valid token');
  }
}

main();
