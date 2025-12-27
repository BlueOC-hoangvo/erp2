/**
 * COMPREHENSIVE BOM API TEST - Kiểm tra tất cả endpoints
 * Mục tiêu: Test từng endpoint, xác định vấn đề và fix để đạt 100%
 */

const axios = require('axios');

const API_BASE = 'http://localhost:4000';

// Get auth token from login first
async function getAuthToken() {
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@erp.local',
      password: 'Admin@123'
    });
    return loginResponse.data.accessToken;
  } catch (error) {
    console.log('❌ Login failed:', error.message);
    return null;
  }
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function logTest(testName, status, response, error) {
  const detail = { testName, status, response, error };
  results.details.push(detail);
  results.total++;
  
  if (status === 'PASSED') {
    results.passed++;
    console.log(`✅ ${testName}: PASSED`);
    if (response) console.log(`   Response: ${JSON.stringify(response, null, 2).substring(0, 200)}...`);
  } else {
    results.failed++;
    console.log(`❌ ${testName}: FAILED`);
    if (error) console.log(`   Error: ${error.message || error}`);
    if (response) console.log(`   Response: ${JSON.stringify(response, null, 2).substring(0, 200)}...`);
  }
  console.log('---');
}

// Utility function to make requests
async function makeRequest(method, url, data = null, customHeaders = {}) {
  try {
    // Get fresh auth token for each request
    const token = await getAuthToken();
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const config = {
      method,
      url: `${API_BASE}${url}`,
      headers: { 
        'Content-Type': 'application/json',
        ...authHeaders,
        ...customHeaders
      }
    };
    
    if (data) config.data = data;
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data 
    };
  }
}

// PHASE 1: BASIC CRUD OPERATIONS (Expected: All working)
async function testBasicCRUD() {
  console.log('\n🧪 PHASE 1: BASIC CRUD OPERATIONS');
  
  // Test 1: GET /boms - List all BOMs
  const listResult = await makeRequest('GET', '/boms?page=1&pageSize=10');
  logTest('GET /boms - List BOMs', listResult.success ? 'PASSED' : 'FAILED', listResult.data, listResult.error);
  
  // Test 2: GET /boms - Search BOMs
  const searchResult = await makeRequest('GET', '/boms?q=test&page=1&pageSize=5');
  logTest('GET /boms - Search BOMs', searchResult.success ? 'PASSED' : 'FAILED', searchResult.data, searchResult.error);
  
  // Test 3: Get first BOM ID for further testing
  let firstBomId = null;
  if (listResult.success && listResult.data.items && listResult.data.items.length > 0) {
    firstBomId = listResult.data.items[0].id;
    console.log(`📋 Using BOM ID ${firstBomId} for further tests`);
    
    // Test 4: GET /boms/:id - Get BOM details
    const getResult = await makeRequest('GET', `/boms/${firstBomId}`);
    logTest(`GET /boms/${firstBomId} - Get BOM details`, getResult.success ? 'PASSED' : 'FAILED', getResult.data, getResult.error);
  } else {
    console.log('⚠️ No BOMs found for detailed testing');
  }
  
  return firstBomId;
}

// PHASE 2: ENHANCED BOM FEATURES (Expected: All working)
async function testEnhancedFeatures(bomId) {
  console.log('\n🚀 PHASE 2: ENHANCED BOM FEATURES');
  
  if (!bomId) {
    console.log('⚠️ Skipping enhanced features test - no BOM ID available');
    return;
  }
  
  // Test 5: GET /boms/:id/explode - BOM explosion
  const explodeResult = await makeRequest('GET', `/boms/${bomId}/explode?quantity=100`);
  logTest(`GET /boms/${bomId}/explode?quantity=100 - BOM explosion`, explodeResult.success ? 'PASSED' : 'FAILED', explodeResult.data, explodeResult.error);
  
  // Test 6: GET /boms/:id/cost - BOM cost calculation
  const costResult = await makeRequest('GET', `/boms/${bomId}/cost?quantity=100`);
  logTest(`GET /boms/${bomId}/cost?quantity=100 - BOM cost`, costResult.success ? 'PASSED' : 'FAILED', costResult.data, costResult.error);
  
  // Test 7: GET /boms/:id/lead-time - BOM lead time
  const leadTimeResult = await makeRequest('GET', `/boms/${bomId}/lead-time`);
  logTest(`GET /boms/${bomId}/lead-time - BOM lead time`, leadTimeResult.success ? 'PASSED' : 'FAILED', leadTimeResult.data, leadTimeResult.error);
}

// PHASE 3: BOM VERSIONING (Expected: Some issues)
async function testVersioning(bomId) {
  console.log('\n🔄 PHASE 3: BOM VERSIONING SYSTEM');
  
  if (!bomId) {
    console.log('⚠️ Skipping versioning test - no BOM ID available');
    return;
  }
  
  // Test 8: GET /boms/:id/current-version - Get current version (main issue)
  const currentVersionResult = await makeRequest('GET', `/boms/${bomId}/current-version`);
  logTest(`GET /boms/${bomId}/current-version - Get current version`, currentVersionResult.success ? 'PASSED' : 'FAILED', currentVersionResult.data, currentVersionResult.error);
  
  // Test 9: POST /boms/:id/versions - Create version
  const createVersionResult = await makeRequest('POST', `/boms/${bomId}/versions`, {
    versionNo: "2.0",
    description: "Test version creation",
    createdById: "1"
  });
  logTest(`POST /boms/${bomId}/versions - Create version`, createVersionResult.success ? 'PASSED' : 'FAILED', createVersionResult.data, createVersionResult.error);
  
  // Get version ID for further tests
  let versionId = null;
  if (createVersionResult.success && createVersionResult.data.id) {
    versionId = createVersionResult.data.id;
    console.log(`📋 Created version ID ${versionId}`);
    
    // Test 10: POST /versions/:id/submit-approval - Submit for approval
    const submitResult = await makeRequest('POST', `/boms/versions/${versionId}/submit-approval`, {
      approvers: ["1", "2"]
    });
    logTest(`POST /boms/versions/${versionId}/submit-approval - Submit for approval`, submitResult.success ? 'PASSED' : 'FAILED', submitResult.data, submitResult.error);
    
    // Test 11: POST /versions/:id/approve - Approve version
    const approveResult = await makeRequest('POST', `/boms/versions/${versionId}/approve`, {
      comments: "Approved for testing"
    });
    logTest(`POST /boms/versions/${versionId}/approve - Approve version`, approveResult.success ? 'PASSED' : 'FAILED', approveResult.data, approveResult.error);
  }
  
  return versionId;
}

// PHASE 4: BOM TEMPLATES (Expected: Some issues)
async function testTemplates() {
  console.log('\n📄 PHASE 4: BOM TEMPLATES SYSTEM');
  
  // Test 12: GET /boms/templates - List templates
  const listTemplatesResult = await makeRequest('GET', '/boms/templates?page=1&pageSize=10');
  logTest('GET /boms/templates - List templates', listTemplatesResult.success ? 'PASSED' : 'FAILED', listTemplatesResult.data, listTemplatesResult.error);
  
  // Test 13: POST /boms/templates - Create template
  const createTemplateResult = await makeRequest('POST', '/boms/templates', {
    name: "Test Template",
    code: "TPL-TEST-001",
    description: "Test template for API testing",
    category: "TEST",
    templateData: {
      lines: [
        {
          itemId: "789",
          uom: "m",
          qtyPerUnit: "1.5",
          wastagePercent: "10.0"
        }
      ]
    }
  });
  logTest('POST /boms/templates - Create template', createTemplateResult.success ? 'PASSED' : 'FAILED', createTemplateResult.data, createTemplateResult.error);
  
  // Get template ID for further tests
  let templateId = null;
  if (createTemplateResult.success && createTemplateResult.data.id) {
    templateId = createTemplateResult.data.id;
    console.log(`📋 Created template ID ${templateId}`);
    
    // Test 14: GET /boms/templates/:id - Get template
    const getTemplateResult = await makeRequest('GET', `/boms/templates/${templateId}`);
    logTest(`GET /boms/templates/${templateId} - Get template`, getTemplateResult.success ? 'PASSED' : 'FAILED', getTemplateResult.data, getTemplateResult.error);
    
    // Test 15: POST /templates/:id/create-bom - Create BOM from template
    const createBomFromTemplateResult = await makeRequest('POST', `/boms/templates/${templateId}/create-bom`, {
      code: "BOM-FROM-TEMPLATE-001",
      productStyleId: "1",
      name: "BOM from Template Test"
    });
    logTest(`POST /boms/templates/${templateId}/create-bom - Create BOM from template`, createBomFromTemplateResult.success ? 'PASSED' : 'FAILED', createBomFromTemplateResult.data, createBomFromTemplateResult.error);
  }
  
  return templateId;
}

// PHASE 5: ERROR HANDLING (Expected: All working)
async function testErrorHandling(bomId) {
  console.log('\n🚫 PHASE 5: ERROR HANDLING');
  
  // Test 16: GET /boms/99999 - Non-existent BOM (404)
  const notFoundResult = await makeRequest('GET', '/boms/99999');
  logTest('GET /boms/99999 - Not found error (404)', !notFoundResult.success && notFoundResult.status === 404 ? 'PASSED' : 'FAILED', notFoundResult.data, notFoundResult.error);
  
  // Test 17: GET /boms?page=0 - Invalid pagination (400)
  const invalidPageResult = await makeRequest('GET', '/boms?page=0');
  logTest('GET /boms?page=0 - Invalid page error (400)', !invalidPageResult.success && invalidPageResult.status === 400 ? 'PASSED' : 'FAILED', invalidPageResult.data, invalidPageResult.error);
  
  // Test 18: GET /boms/:id/explode?quantity=-1 - Invalid quantity (400)
  if (bomId) {
    const invalidQuantityResult = await makeRequest('GET', `/boms/${bomId}/explode?quantity=-1`);
    logTest(`GET /boms/${bomId}/explode?quantity=-1 - Invalid quantity error (400)`, !invalidQuantityResult.success && invalidQuantityResult.status === 400 ? 'PASSED' : 'FAILED', invalidQuantityResult.data, invalidQuantityResult.error);
  }
}

// PHASE 6: AUTHENTICATION TESTS (Expected: Mixed results)
async function testAuthentication(bomId) {
  console.log('\n🔐 PHASE 6: AUTHENTICATION TESTS');
  
  // Test 19: POST /boms without auth (should be 401)
  const noAuthResult = await makeRequest('POST', '/boms', {
    code: "BOM-NO-AUTH-TEST",
    productStyleId: "1",
    name: "Test BOM without auth"
  }, { Authorization: '' }); // Remove auth header
  logTest('POST /boms without auth - Should be 401', !noAuthResult.success && noAuthResult.status === 401 ? 'PASSED' : 'FAILED', noAuthResult.data, noAuthResult.error);
  
  // Test 20: GET /boms without auth (should work for GET)
  const getNoAuthResult = await makeRequest('GET', '/boms?page=1&pageSize=5', null, { Authorization: '' });
  logTest('GET /boms without auth - Should work for GET', getNoAuthResult.success ? 'PASSED' : 'FAILED', getNoAuthResult.data, getNoAuthResult.error);
}

// Main test runner
async function runAllTests() {
  console.log('🧪 COMPREHENSIVE BOM API TESTING');
  console.log('================================');
  console.log('Mục tiêu: Test tất cả endpoints và xác định vấn đề để fix');
  console.log('API Base:', API_BASE);
  console.log('');
  
  try {
    // Run all test phases
    const bomId = await testBasicCRUD();
    await testEnhancedFeatures(bomId);
    await testVersioning(bomId);
    await testTemplates();
    await testErrorHandling(bomId);
    await testAuthentication(bomId);
    
    // Summary
    console.log('\n📊 FINAL TEST SUMMARY');
    console.log('=====================');
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed} ✅`);
    console.log(`Failed: ${results.failed} ❌`);
    console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    // Save detailed results
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `test-results/comprehensive-bom-test-${timestamp}.json`;
    
    fs.writeFileSync(reportFile, JSON.stringify({
      timestamp,
      summary: {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        successRate: (results.passed / results.total * 100).toFixed(1)
      },
      details: results.details
    }, null, 2));
    
    console.log(`\n📄 Detailed results saved to: ${reportFile}`);
    
    // Identify critical issues
    const criticalIssues = results.details.filter(d => d.status === 'FAILED').map(d => d.testName);
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES TO FIX:');
      criticalIssues.forEach(issue => console.log(`   • ${issue}`));
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Run the tests
runAllTests();
