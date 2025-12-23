const axios = require('axios');

// Simple test script to verify sales orders API works after permission fix
async function testSalesOrdersAPI() {
  try {
    console.log('🧪 Testing sales orders API...\n');
    
    // Test login first to get a token
    const loginResponse = await axios.post('http://localhost:4000/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    }, {
      timeout: 10000
    });
    
    const { accessToken } = loginResponse.data.data;
    console.log('✅ Login successful');
    
    // Test sales orders endpoint
    const salesResponse = await axios.get('http://localhost:4000/sales-orders?page=1&limit=20', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      timeout: 10000
    });
    
    console.log('✅ Sales orders API accessible!');
    console.log('Response:', salesResponse.data);
    
  } catch (error) {
    if (error.response) {
      console.log(`❌ API Error: ${error.response.status} - ${error.response.statusText}`);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      console.log('❌ Network Error: No response received');
      console.log('Is the backend server running on localhost:4000?');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

module.exports = { testSalesOrdersAPI };

// Run test if this file is executed directly
if (require.main === module) {
  testSalesOrdersAPI();
}
