#!/usr/bin/env node

/**
 * Test BOM và Production Order Integration
 * 
 * Test flow:
 * 1. Tạo BOM cho product style
 * 2. Tạo Production Order
 * 3. Generate materials từ BOM
 * 4. Verify kết quả
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
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

// Test data setup
const testData = {
  productStyle: {
    name: `Test Product ${Date.now()}`,
    code: `TEST${Date.now()}`,
    description: 'Test product for BOM integration'
  },
  
  bom: {
    name: `Test BOM ${Date.now()}`,
    version: '1.0',
    isActive: true
  },
  
  bomLines: [
    {
      itemName: 'Cotton Fabric',
      uom: 'meter',
      qtyPerUnit: 1.5,
      wastagePercent: 5
    },
    {
      itemName: 'Thread',
      uom: 'meter', 
      qtyPerUnit: 50,
      wastagePercent: 0
    },
    {
      itemName: 'Button',
      uom: 'piece',
      qtyPerUnit: 6,
      wastagePercent: 2
    }
  ],

  items: [
    {
      name: 'Cotton Fabric',
      code: 'FAB001',
      category: 'fabric',
      uom: 'meter'
    },
    {
      name: 'Thread',
      code: 'THR001', 
      category: 'accessory',
      uom: 'meter'
    },
    {
      name: 'Button',
      code: 'BTN001',
      category: 'accessory', 
      uom: 'piece'
    }
  ],

  productionOrder: {
    qtyPlan: 100,
    startDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    note: 'Test production order with endDate'
  }
};

let createdData = {};

async function runTests() {
  console.log('🧪 Starting BOM + Production Order Integration Tests...\n');

  try {
    // Test 1: Create Items
    console.log('📦 Test 1: Creating Items...');
    const itemIds = [];
    
    for (const item of testData.items) {
      const result = await apiCall('POST', '/items', item);
      if (result.success) {
        itemIds.push(result.data.id);
        console.log(`✅ Created item: ${item.name} (ID: ${result.data.id})`);
      } else {
        console.log(`❌ Failed to create item ${item.name}:`, result.error);
      }
    }

    // Test 2: Create Product Style
    console.log('\n👕 Test 2: Creating Product Style...');
    const productStyleResult = await apiCall('POST', '/product-styles', testData.productStyle);
    if (productStyleResult.success) {
      createdData.productStyleId = productStyleResult.data.id;
      console.log(`✅ Created product style: ${testData.productStyle.name} (ID: ${createdData.productStyleId})`);
    } else {
      console.log('❌ Failed to create product style:', productStyleResult.error);
      return;
    }

    // Test 3: Create BOM
    console.log('\n📋 Test 3: Creating BOM...');
    const bomData = {
      ...testData.bom,
      productStyleId: createdData.productStyleId
    };
    
    const bomResult = await apiCall('POST', '/boms', bomData);
    if (bomResult.success) {
      createdData.bomId = bomResult.data.id;
      console.log(`✅ Created BOM: ${testData.bom.name} (ID: ${createdData.bomId})`);
    } else {
      console.log('❌ Failed to create BOM:', bomResult.error);
      return;
    }

    // Test 4: Create BOM Lines
    console.log('\n📝 Test 4: Creating BOM Lines...');
    for (let i = 0; i < testData.bomLines.length; i++) {
      const line = testData.bomLines[i];
      const lineData = {
        ...line,
        itemId: itemIds[i],
        bomId: createdData.bomId
      };
      
      const lineResult = await apiCall('POST', '/bom-lines', lineData);
      if (lineResult.success) {
        console.log(`✅ Created BOM line: ${line.itemName} - ${line.qtyPerUnit} ${line.uom}`);
      } else {
        console.log(`❌ Failed to create BOM line ${line.itemName}:`, lineResult.error);
      }
    }

    // Test 5: Create Production Order
    console.log('\n🏭 Test 5: Creating Production Order...');
    const productionOrderData = {
      ...testData.productionOrder,
      productStyleId: createdData.productStyleId
    };
    
    const poResult = await apiCall('POST', '/production-orders', productionOrderData);
    if (poResult.success) {
      createdData.productionOrderId = poResult.data.id;
      console.log(`✅ Created Production Order (ID: ${createdData.productionOrderId})`);
      console.log(`   - Quantity: ${testData.productionOrder.qtyPlan}`);
      console.log(`   - Start Date: ${testData.productionOrder.startDate}`);
      console.log(`   - End Date: ${testData.productionOrder.endDate} ✅`);
    } else {
      console.log('❌ Failed to create Production Order:', poResult.error);
      return;
    }

    // Test 6: Generate Materials from BOM
    console.log('\n🔄 Test 6: Generating Materials from BOM...');
    const generateResult = await apiCall('POST', `/production-orders/${createdData.productionOrderId}/generate-materials-from-bom?mode=replace`);
    if (generateResult.success) {
      console.log('✅ Materials generated successfully!');
      console.log(`   - BOM ID: ${generateResult.data.bomId}`);
      console.log(`   - Mode: ${generateResult.data.mode}`);
      console.log(`   - Items generated: ${generateResult.data.items.length}`);
      
      generateResult.data.items.forEach(item => {
        console.log(`     • ${item.item.name}: ${item.qtyRequired} ${item.uom} (wastage: ${item.wastagePercent}%)`);
      });
    } else {
      console.log('❌ Failed to generate materials:', generateResult.error);
    }

    // Test 7: Verify Production Order with endDate
    console.log('\n🔍 Test 7: Verifying Production Order...');
    const verifyResult = await apiCall('GET', `/production-orders/${createdData.productionOrderId}`);
    if (verifyResult.success) {
      console.log('✅ Production Order retrieved successfully!');
      console.log(`   - MO No: ${verifyResult.data.moNo}`);
      console.log(`   - Status: ${verifyResult.data.status}`);
      console.log(`   - Start Date: ${verifyResult.data.startDate}`);
      console.log(`   - End Date: ${verifyResult.data.endDate || 'Not set'} ${verifyResult.data.endDate ? '✅' : '❌'}`);
      console.log(`   - Material Requirements: ${verifyResult.data.materialRequirements?.length || 0}`);
    } else {
      console.log('❌ Failed to verify Production Order:', verifyResult.error);
    }

    console.log('\n🎉 Integration test completed!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Check if server is running
async function checkServer() {
  console.log('🔍 Checking server status...');
  const result = await apiCall('GET', '/health');
  if (result.success) {
    console.log('✅ Server is running!');
    return true;
  } else {
    console.log('❌ Server is not responding:', result.error);
    console.log('💡 Make sure to start the server first with: npm start');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main().catch(console.error);
