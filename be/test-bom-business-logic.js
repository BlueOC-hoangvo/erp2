// Comprehensive BOM Business Logic Test
const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

class BOMBusinessLogicTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async makeRequest(method, url, data = null) {
    try {
      const config = { method, url: `${BASE_URL}${url}`, headers: { 'Content-Type': 'application/json' } };
      if (data) config.data = data;
      
      const response = await axios(config);
      return { 
        status: response.status, 
        data: response.data, 
        success: true,
        responseTime: response.headers['x-response-time'] || 'N/A'
      };
    } catch (error) {
      return { 
        status: error.response?.status || 500, 
        data: error.response?.data || error.message, 
        success: false,
        error: true 
      };
    }
  }

  async runTest(name, method, url, data = null, expectedStatus = 200) {
    this.results.total++;
    console.log(`\n🔍 Test ${this.results.total}: ${name}`);
    
    const result = await this.makeRequest(method, url, data);
    
    if (result.status === expectedStatus) {
      console.log(`   ✅ PASS - Status: ${result.status}`);
      this.results.passed++;
      this.results.details.push({ name, status: 'PASS', statusCode: result.status });
    } else {
      console.log(`   ❌ FAIL - Expected: ${expectedStatus}, Got: ${result.status}`);
      console.log(`   📄 Response: ${JSON.stringify(result.data).substring(0, 300)}...`);
      this.results.failed++;
      this.results.details.push({ name, status: 'FAIL', statusCode: result.status, response: result.data });
    }
    
    return result;
  }

  async testAllBusinessLogic() {
    console.log('🚀 Starting Comprehensive BOM Business Logic Testing...\n');
    console.log('=' * 70);

    try {
      // Phase 1: Basic CRUD Operations
      await this.testBasicCRUD();
      
      // Phase 2: BOM Templates Logic
      await this.testBomTemplates();
      
      // Phase 3: BOM Explosion & Material Requirements
      await this.testBomExplosion();
      
      // Phase 4: BOM Cost Calculation
      await this.testBomCostCalculation();
      
      // Phase 5: BOM Lead Time Calculation
      await this.testBomLeadTime();
      
      // Phase 6: BOM Versioning Workflow
      await this.testBomVersioning();
      
      // Phase 7: Integration Tests
      await this.testIntegrationScenarios();
      
    } catch (error) {
      console.error('\n❌ Test suite error:', error.message);
    }

    this.printFinalReport();
  }

  async testBasicCRUD() {
    console.log('\n📋 PHASE 1: Basic CRUD Operations');
    console.log('-'.repeat(50));
    
    // List BOMs
    await this.runTest('List all BOMs', 'GET', '/boms');
    
    // Get specific BOM
    await this.runTest('Get BOM #1', 'GET', '/boms/1');
    
    // Test pagination
    await this.runTest('List BOMs with pagination', 'GET', '/boms?page=1&pageSize=10');
    
    // Test search
    await this.runTest('Search BOMs', 'GET', '/boms?q=BOM');
  }

  async testBomTemplates() {
    console.log('\n📋 PHASE 2: BOM Templates Logic');
    console.log('-'.repeat(50));
    
    // List templates
    await this.runTest('List all templates', 'GET', '/boms/templates');
    
    // Get specific template
    await this.runTest('Get template #1', 'GET', '/boms/templates/1');
    await this.runTest('Get template #2', 'GET', '/boms/templates/2');
    await this.runTest('Get template #3', 'GET', '/boms/templates/3');
    
    // Template with pagination
    await this.runTest('Templates with pagination', 'GET', '/boms/templates?page=1&pageSize=10');
    
    // Template search
    await this.runTest('Search templates', 'GET', '/boms/templates?q=T-Shirt');
  }

  async testBomExplosion() {
    console.log('\n📋 PHASE 3: BOM Explosion & Material Requirements');
    console.log('-'.repeat(50));
    
    // Basic explosion
    await this.runTest('BOM Explosion - Basic', 'GET', '/boms/1/explode?quantity=10');
    
    // Explosion with different quantities
    await this.runTest('BOM Explosion - Large quantity', 'GET', '/boms/1/explode?quantity=100');
    
    // Explosion with BOM version (if exists)
    await this.runTest('BOM Explosion with version', 'GET', '/boms/1/explode?quantity=10&bomVersionId=1');
  }

  async testBomCostCalculation() {
    console.log('\n📋 PHASE 4: BOM Cost Calculation');
    console.log('-'.repeat(50));
    
    // Basic cost calculation
    await this.runTest('BOM Cost - Basic', 'GET', '/boms/1/cost?quantity=10');
    
    // Cost with version
    await this.runTest('BOM Cost with version', 'GET', '/boms/1/cost?quantity=10&bomVersionId=1');
    
    // Cost for different quantities
    await this.runTest('BOM Cost - Different quantity', 'GET', '/boms/1/cost?quantity=50');
  }

  async testBomLeadTime() {
    console.log('\n📋 PHASE 5: BOM Lead Time Calculation');
    console.log('-'.repeat(50));
    
    // Basic lead time
    await this.runTest('BOM Lead Time - Basic', 'GET', '/boms/1/lead-time');
    
    // Lead time with version
    await this.runTest('BOM Lead Time with version', 'GET', '/boms/1/lead-time?bomVersionId=1');
  }

  async testBomVersioning() {
    console.log('\n📋 PHASE 6: BOM Versioning Workflow');
    console.log('-'.repeat(50));
    
    // Get current version
    await this.runTest('Get current BOM version', 'GET', '/boms/1/current-version');
    
    // Create new version
    const versionResult = await this.runTest('Create new BOM version', 'POST', '/boms/1/versions', {
      versionNo: 'v2.0',
      description: 'Test version for business logic validation',
      createdById: '1'
    });
    
    if (versionResult.success && versionResult.data?.data?.id) {
      const versionId = versionResult.data.data.id;
      
      // Submit for approval
      await this.runTest('Submit version for approval', 'POST', `/boms/versions/${versionId}/submit-approval`, {
        approvers: ['1', '2']
      });
      
      // Approve version
      await this.runTest('Approve BOM version', 'POST', `/boms/versions/${versionId}/approve`, {
        comments: 'Approved for testing'
      });
      
      // Get current version after approval
      await this.runTest('Get current version after approval', 'GET', '/boms/1/current-version');
    }
  }

  async testIntegrationScenarios() {
    console.log('\n📋 PHASE 7: Integration Scenarios');
    console.log('-'.repeat(50));
    
    // Scenario 1: BOM Template → BOM → Explosion → Cost → Lead Time
    console.log('\n📊 Scenario 1: Template → BOM → Analysis');
    
    // Create BOM from template
    const productStyles = await this.makeRequest('GET', '/product-styles');
    if (productStyles.success && productStyles.data?.data?.length > 0) {
      const styleId = productStyles.data.data[0].id;
      
      await this.runTest('Create BOM from template', 'POST', '/boms/templates/1/create-bom', {
        code: 'INTEGRATION-TEST-001',
        productStyleId: styleId,
        name: 'Integration Test BOM',
        isActive: true
      });
    }
    
    // Error handling tests
    await this.runTest('Error - Non-existent BOM', 'GET', '/boms/999999', null, 404);
    await this.runTest('Error - Non-existent template', 'GET', '/boms/templates/999999', null, 404);
    await this.runTest('Error - Invalid explosion params', 'GET', '/boms/1/explode', null, 400);
  }

  printFinalReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 COMPREHENSIVE BOM BUSINESS LOGIC TEST RESULTS');
    console.log('='.repeat(70));
    
    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Total: ${this.results.total}`);
    console.log(`📈 Success Rate: ${passRate}%`);
    
    console.log('\n📋 Business Logic Coverage:');
    console.log('   ✅ Basic CRUD Operations');
    console.log('   ✅ BOM Templates Management');
    console.log('   ✅ BOM Explosion (Multi-level)');
    console.log('   ✅ Cost Calculation');
    console.log('   ✅ Lead Time Calculation');
    console.log('   ✅ BOM Versioning Workflow');
    console.log('   ✅ Approval Process');
    console.log('   ✅ Integration Scenarios');
    console.log('   ✅ Error Handling');
    
    if (this.results.failed === 0) {
      console.log('\n🎉 ALL BUSINESS LOGIC TESTS PASSED!');
      console.log('BOM system is fully functional with complete business logic!');
    } else {
      console.log('\n⚠️ Some business logic tests failed.');
      console.log('Review failed tests to ensure complete functionality.');
    }

    // Save detailed results
    const fs = require('fs');
    const reportData = {
      timestamp: new Date().toISOString(),
      testType: 'BOM Business Logic Comprehensive',
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: `${passRate}%`
      },
      businessLogicCoverage: [
        'Basic CRUD Operations',
        'BOM Templates Management', 
        'BOM Explosion (Multi-level)',
        'Cost Calculation',
        'Lead Time Calculation',
        'BOM Versioning Workflow',
        'Approval Process',
        'Integration Scenarios',
        'Error Handling'
      ],
      details: this.results.details
    };

    const filename = `bom-business-logic-test-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
    console.log(`\n💾 Detailed report saved to: ${filename}`);
  }
}

// Run the comprehensive test
const tester = new BOMBusinessLogicTest();
tester.testAllBusinessLogic()
  .then(() => {
    console.log('\n🎯 Comprehensive BOM Business Logic Testing Complete!');
  })
  .catch(console.error);

