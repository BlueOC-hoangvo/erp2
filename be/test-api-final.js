const axios = require('axios');

const API_BASE = 'http://localhost:4000'; // Server đang chạy trên port 4000 (không có /api prefix)

async function testAllAPIs() {
  console.log('🧪 Testing BOM and ERP API Endpoints...\n');

  const results = {
    bom: false,
    productionOrders: false,
    inventory: false,
    salesOrders: false,
    purchaseOrders: false,
    stockMoves: false,
    templates: false
  };

  try {
    // Test 1: BOM API
    console.log('📋 Testing BOM API...');
    try {
      const boms = await axios.get(`${API_BASE}/boms?page=1&pageSize=5`);
      console.log(`   ✅ BOM List: ${boms.data.items?.length || 0} items`);
      results.bom = true;
    } catch (error) {
      console.log(`   ❌ BOM API Error: ${error.response?.status || 'Unknown'}`);
    }

    // Test 2: Production Orders API
    console.log('\n🏭 Testing Production Orders API...');
    try {
      const pos = await axios.get(`${API_BASE}/production-orders?page=1&pageSize=5`);
      console.log(`   ✅ Production Orders: ${pos.data.items?.length || 0} items`);
      results.productionOrders = true;
    } catch (error) {
      console.log(`   ❌ Production Orders API Error: ${error.response?.status || 'Unknown'}`);
    }

    // Test 3: Inventory API
    console.log('\n📦 Testing Inventory API...');
    try {
      const inv = await axios.get(`${API_BASE}/inventory/onhand?page=1&pageSize=5`);
      console.log(`   ✅ Inventory Items: ${inv.data.items?.length || 0} items`);
      console.log(`   ✅ Inventory Variants: ${inv.data.variants?.length || 0} variants`);
      results.inventory = true;
    } catch (error) {
      console.log(`   ❌ Inventory API Error: ${error.response?.status || 'Unknown'}`);
    }

    // Test 4: Sales Orders API
    console.log('\n💰 Testing Sales Orders API...');
    try {
      const sos = await axios.get(`${API_BASE}/sales-orders?page=1&pageSize=5`);
      console.log(`   ✅ Sales Orders: ${sos.data.items?.length || 0} items`);
      results.salesOrders = true;
    } catch (error) {
      console.log(`   ❌ Sales Orders API Error: ${error.response?.status || 'Unknown'}`);
    }

    // Test 5: Purchase Orders API
    console.log('\n🛒 Testing Purchase Orders API...');
    try {
      const posPO = await axios.get(`${API_BASE}/purchase-orders?page=1&pageSize=5`);
      console.log(`   ✅ Purchase Orders: ${posPO.data.items?.length || 0} items`);
      results.purchaseOrders = true;
    } catch (error) {
      console.log(`   ❌ Purchase Orders API Error: ${error.response?.status || 'Unknown'}`);
    }

    // Test 6: Stock Moves API
    console.log('\n🚚 Testing Stock Moves API...');
    try {
      const moves = await axios.get(`${API_BASE}/stock-moves?page=1&pageSize=5`);
      console.log(`   ✅ Stock Moves: ${moves.data.items?.length || 0} items`);
      results.stockMoves = true;
    } catch (error) {
      console.log(`   ❌ Stock Moves API Error: ${error.response?.status || 'Unknown'}`);
    }

    // Test 7: BOM Templates API
    console.log('\n📄 Testing BOM Templates API...');
    try {
      const templates = await axios.get(`${API_BASE}/boms/templates`);
      console.log(`   ✅ BOM Templates: ${templates.data.items?.length || 0} items`);
      results.templates = true;
    } catch (error) {
      console.log(`   ❌ BOM Templates API Error: ${error.response?.status || 'Unknown'}`);
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }

  // Summary
  console.log('\n📊 API Test Results:');
  console.log('=' .repeat(50));
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`BOM API:                ${results.bom ? '✅' : '❌'}`);
  console.log(`Production Orders API:  ${results.productionOrders ? '✅' : '❌'}`);
  console.log(`Inventory API:          ${results.inventory ? '✅' : '❌'}`);
  console.log(`Sales Orders API:       ${results.salesOrders ? '✅' : '❌'}`);
  console.log(`Purchase Orders API:    ${results.purchaseOrders ? '✅' : '❌'}`);
  console.log(`Stock Moves API:        ${results.stockMoves ? '✅' : '❌'}`);
  console.log(`BOM Templates API:      ${results.templates ? '✅' : '❌'}`);
  console.log('=' .repeat(50));
  console.log(`Success Rate: ${((passed/total) * 100).toFixed(1)}% (${passed}/${total})`);
  
  if (passed === total) {
    console.log('\n🎉 All API endpoints are working perfectly!');
  } else {
    console.log(`\n⚠️  ${total - passed} API endpoint(s) need attention`);
  }
}

testAllAPIs().catch(console.error);
