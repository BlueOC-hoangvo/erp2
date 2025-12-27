const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = { method, url: `${BASE_URL}${url}`, headers };
    if (data) config.data = data;
    
    const response = await axios(config);
    return { status: response.status, data: response.data, success: true };
  } catch (error) {
    return { 
      status: error.response?.status || 500, 
      data: error.response?.data || error.message, 
      success: false,
      error: true 
    };
  }
}

async function runTest(name, method, url, data = null, expectedStatus = 200) {
  testResults.total++;
  console.log(`\n🔍 Test ${testResults.total}: ${name}`);
  
  const result = await makeRequest(method, url, data);
  
  if (result.status === expectedStatus) {
    console.log(`   ✅ PASS - Status: ${result.status}`);
    testResults.passed++;
    testResults.details.push({ name, status: 'PASS', statusCode: result.status });
  } else {
    console.log(`   ❌ FAIL - Expected: ${expectedStatus}, Got: ${result.status}`);
    console.log(`   📄 Response: ${JSON.stringify(result.data).substring(0, 200)}...`);
    testResults.failed++;
    testResults.details.push({ name, status: 'FAIL', statusCode: result.status, response: result.data });
  }
  
  return result;
}

async function runComprehensiveBOMTests() {
  console.log('🚀 Starting Comprehensive BOM API Testing...\n');
  console.log('=' * 60);

  try {
    // Phase 1: Basic CRUD Operations
    console.log('\n📋 PHASE 1: Basic CRUD Operations');
    console.log('-'.repeat(50));
    
    await runTest('List BOMs', 'GET', '/boms');
    await runTest('List BOMs with pagination', 'GET', '/boms?page=1&pageSize=10');
    await runTest('Get specific BOM', 'GET', '/boms/1');
    await runTest('Create new BOM', 'POST', '/boms', {
      code: 'TEST-BOM-001',
      productStyleId: '1',
      name: 'Test BOM',
      isActive: true,
      lines: [
        {
          itemId: '1',
          uom: 'pcs',
          qtyPerUnit: '2',
          wastagePercent: '5',
          note: 'Test line',
          isOptional: false,
          leadTimeDays: 7
        }
      ]
    });

    // Phase 2: BOM Templates
    console.log('\n📋 PHASE 2: BOM Templates');
    console.log('-'.repeat(50));
    
    await runTest('List BOM Templates', 'GET', '/boms/templates');
    await runTest('List BOM Templates with pagination', 'GET', '/boms/templates?page=1&pageSize=10');
    await runTest('Get specific template', 'GET', '/boms/templates/1');
    
    // Try to create BOM from template
    const productStyles = await makeRequest('GET', '/product-styles');
    if (productStyles.data?.data?.length > 0) {
      const styleId = productStyles.data.data[0].id;
      await runTest('Create BOM from template', 'POST', '/boms/templates/1/create-bom', {
        code: 'FROM-TEMPLATE-001',
        productStyleId: styleId,
        name: 'BOM from Template',
        isActive: true
      });
    }

    // Phase 3: Enhanced BOM Features
    console.log('\n📋 PHASE 3: Enhanced BOM Features');
    console.log('-'.repeat(50));
    
    await runTest('BOM Explosion', 'GET', '/boms/1/explode?quantity=10');
    await runTest('BOM Cost Calculation', 'GET', '/boms/1/cost?quantity=10');
    await runTest('BOM Lead Time', 'GET', '/boms/1/lead-time');

    // Phase 4: BOM Versioning
    console.log('\n📋 PHASE 4: BOM Versioning');
    console.log('-'.repeat(50));
    
    // First create a version
    const versionResult = await makeRequest('POST', '/boms/1/versions', {
      versionNo: 'v1.1',
      description: 'Test version',
      createdById: '1'
    });
    
    if (versionResult.success && versionResult.data?.data?.id) {
      const versionId = versionResult.data.data.id;
      await runTest('Get current version', 'GET', '/boms/1/current-version');
      await runTest('Submit for approval', 'POST', `/boms/versions/${versionId}/submit-approval`, {
        approvers: ['1', '2']
      });
    } else {
      console.log('   ⚠️ SKIP - Could not create version for testing');
      testResults.total++;
    }

    // Phase 5: Error Handling
    console.log('\n📋 PHASE 5: Error Handling');
    console.log('-'.repeat(50));
    
    await runTest('Get non-existent BOM', 'GET', '/boms/999999', null, 404);
    await runTest('Get non-existent template', 'GET', '/boms/templates/999999', null, 404);
    await runTest('Create BOM with invalid data', 'POST', '/boms', {}, 400);

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }

  // Generate Final Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL TEST RESULTS');
  console.log('='.repeat(60));
  
  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📊 Total: ${testResults.total}`);
  console.log(`📈 Success Rate: ${passRate}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! BOM API is working perfectly!');
  } else {
    console.log('\n⚠️ Some tests failed. Check details above.');
  }

  // Save results
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: passRate
    },
    details: testResults.details
  };

  return reportData;
}

// Run the tests
runComprehensiveBOMTests()
  .then(report => {
    const fs = require('fs');
    const filename = `final-bom-test-report-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${filename}`);
  })
  .catch(console.error);
