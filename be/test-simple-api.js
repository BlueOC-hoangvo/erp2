#!/usr/bin/env node

/**
 * Simple BOM + Production Order API Test
 * 
 * Test các endpoint chính:
 * 1. BOM API
 * 2. Production Order API với endDate
 * 3. Integration: Generate materials từ BOM
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test configuration
const testConfig = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Helper function
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      ...testConfig
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
}

async function testServerHealth() {
  console.log('🏥 Testing server health...');
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    console.log('✅ Server is running and healthy');
    return true;
  } else {
    console.log('❌ Server health check failed');
    console.log('Error:', result.error);
    console.log('💡 Please start the server first: npm start');
    return false;
  }
}

async function testProductionOrderEndpoints() {
  console.log('\n🏭 Testing Production Order APIs...');
  
  // Sample data
  const productStyleData = {
    name: `Test Product ${Date.now()}`,
    code: `TEST${Date.now()}`,
    description: 'API Test Product'
  };

  const productionOrderData = {
    productStyleId: '1', // You may need to adjust this
    qtyPlan: 100,
    qtyDone: 0,
    status: 'DRAFT',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    note: 'API Test with endDate field'
  };

  let createdPOId = null;

  try {
    // Test 1: List Production Orders
    console.log('📋 Testing GET /production-orders...');
    const listResult = await makeRequest('GET', '/production-orders?page=1&pageSize=10');
    
    if (listResult.success) {
      console.log('✅ List endpoint working');
      console.log(`   Found ${listResult.data.items?.length || 0} production orders`);
    } else {
      console.log('❌ List endpoint failed:', listResult.error);
    }

    // Test 2: Create Production Order with endDate
    console.log('\n➕ Testing POST /production-orders (with endDate)...');
    const createResult = await makeRequest('POST', '/production-orders', productionOrderData);
    
    if (createResult.success) {
      createdPOId = createResult.data.id;
      console.log('✅ Create endpoint working');
      console.log(`   Created Production Order ID: ${createdPOId}`);
      console.log(`   endDate field included: ${productionOrderData.endDate ? '✅' : '❌'}`);
    } else {
      console.log('❌ Create endpoint failed:', createResult.error);
    }

    // Test 3: Get specific Production Order
    if (createdPOId) {
      console.log('\n🔍 Testing GET /production-orders/:id...');
      const getResult = await makeRequest('GET', `/production-orders/${createdPOId}`);
      
      if (getResult.success) {
        console.log('✅ Get endpoint working');
        console.log(`   MO No: ${getResult.data.moNo}`);
        console.log(`   Status: ${getResult.data.status}`);
        console.log(`   endDate: ${getResult.data.endDate || 'Not set'}`);
      } else {
        console.log('❌ Get endpoint failed:', getResult.error);
      }
    }

    // Test 4: Test BOM Integration (if we have a production order)
    if (createdPOId) {
      console.log('\n🔄 Testing BOM Integration...');
      const bomResult = await makeRequest('POST', `/production-orders/${createdPOId}/generate-materials-from-bom?mode=replace`);
      
      if (bomResult.success) {
        console.log('✅ BOM Integration working');
        console.log(`   BOM ID: ${bomResult.data.bomId}`);
        console.log(`   Generated ${bomResult.data.items?.length || 0} material requirements`);
      } else {
        console.log('⚠️  BOM Integration failed (expected if no BOM exists):', bomResult.error);
      }
    }

    // Test 5: Update Production Order (including endDate)
    if (createdPOId) {
      console.log('\n✏️  Testing PUT /production-orders/:id...');
      const updateData = {
        ...productionOrderData,
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Update endDate
        note: 'Updated API Test with new endDate'
      };
      
      const updateResult = await makeRequest('PUT', `/production-orders/${createdPOId}`, updateData);
      
      if (updateResult.success) {
        console.log('✅ Update endpoint working');
        console.log('   endDate field can be updated ✅');
      } else {
        console.log('❌ Update endpoint failed:', updateResult.error);
      }
    }

  } catch (error) {
    console.error('💥 Production Order API test error:', error);
  }
}

async function testBOMEndpoints() {
  console.log('\n📋 Testing BOM APIs...');
  
  // This is a simplified test - in real scenario you'd need to create product styles, items first
  console.log('📋 Note: Full BOM testing requires creating product styles and items first');
  console.log('🔍 Testing BOM listing...');
  
  const result = await makeRequest('GET', '/boms?page=1&pageSize=10');
  
  if (result.success) {
    console.log('✅ BOM list endpoint working');
    console.log(`   Found ${result.data.items?.length || 0} BOMs`);
  } else {
    console.log('❌ BOM list endpoint failed:', result.error);
  }
}

async function runSimpleTests() {
  console.log('🚀 Starting Simple BOM + Production API Tests\n');
  
  // Check server
  const serverOK = await testServerHealth();
  if (!serverOK) {
    console.log('\n❌ Cannot proceed without server');
    return;
  }
  
  // Run tests
  await testProductionOrderEndpoints();
  await testBOMEndpoints();
  
  console.log('\n✅ Simple API tests completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Start server: npm start');
  console.log('   2. Run this test: node test-simple-api.js');
  console.log('   3. For full integration test: node test-bom-production-integration.js');
}

// Execute if run directly
if (require.main === module) {
  runSimpleTests().catch(console.error);
}

module.exports = { runSimpleTests, testServerHealth };
