/**
 * Simple BOM API Test - Test các endpoints cơ bản trước
 */
const axios = require('axios');

const API_BASE = 'http://localhost:4000';

async function testEndpoint(name, method, url, data = null) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`${method} ${url}`);
    
    const config = {
      method,
      url: `${API_BASE}${url}`,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) config.data = data;
    
    const response = await axios(config);
    console.log(`✅ SUCCESS: ${response.status}`);
    console.log(`Response:`, JSON.stringify(response.data, null, 2).substring(0, 300) + '...');
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`❌ FAILED: ${error.response?.status || error.message}`);
    console.log(`Error:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function runSimpleTests() {
  console.log('🧪 SIMPLE BOM API TESTS');
  console.log('========================');
  
  // Test 1: List BOMs
  await testEndpoint('List BOMs', 'GET', '/boms?page=1&pageSize=5');
  
  // Test 2: Search BOMs
  await testEndpoint('Search BOMs', 'GET', '/boms?q=test');
  
  // Test 3: Get BOM details (nếu có BOM nào đó)
  await testEndpoint('Get BOM by ID', 'GET', '/boms/36');
  
  // Test 4: BOM explosion
  await testEndpoint('BOM Explosion', 'GET', '/boms/36/explode?quantity=10');
  
  // Test 5: BOM cost
  await testEndpoint('BOM Cost', 'GET', '/boms/36/cost?quantity=10');
  
  // Test 6: BOM lead time
  await testEndpoint('BOM Lead Time', 'GET', '/boms/36/lead-time');
  
  // Test 7: Current version
  await testEndpoint('Current Version', 'GET', '/boms/36/current-version');
  
  // Test 8: List templates
  await testEndpoint('List Templates', 'GET', '/boms/templates');
  
  // Test 9: Get template by ID
  await testEndpoint('Get Template', 'GET', '/boms/templates/1');
  
  // Test 10: Error handling - Not found
  await testEndpoint('Not Found', 'GET', '/boms/99999');
  
  console.log('\n✅ Simple tests completed!');
}

runSimpleTests().catch(console.error);
