const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Test configuration
const BASE_URL = 'http://localhost:4000';
const TEST_DATA_PATH = path.join(__dirname, 'test-data');
const RESULTS_PATH = path.join(__dirname, 'test-results');

// Ensure directories exist
if (!fs.existsSync(TEST_DATA_PATH)) fs.mkdirSync(TEST_DATA_PATH, { recursive: true });
if (!fs.existsSync(RESULTS_PATH)) fs.mkdirSync(RESULTS_PATH, { recursive: true });

// Test results storage
const testResults = {
  startTime: new Date().toISOString(),
  phases: {},
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  }
};

// Test helper functions
class BomApiTester {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async testPhase(name, tests) {
    console.log(`\n🚀 Starting Phase: ${name}`);
    testResults.phases[name] = {
      startTime: new Date().toISOString(),
      tests: [],
      passed: 0,
      failed: 0
    };

    for (const test of tests) {
      await this.runTest(name, test);
    }

    testResults.phases[name].endTime = new Date().toISOString();
    console.log(`✅ Phase ${name} completed`);
  }

  async runTest(phaseName, test) {
    const { name, method, url, data, expectedStatus, description } = test;
    testResults.summary.total++;
    
    try {
      console.log(`  🔍 Testing: ${name}`);
      
      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await this.api.get(url, { params: data });
          break;
        case 'POST':
          response = await this.api.post(url, data);
          break;
        case 'PUT':
          response = await this.api.put(url, data);
          break;
        case 'DELETE':
          response = await this.api.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      if (expectedStatus && response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
      }

      // Success
      testResults.phases[phaseName].tests.push({
        name,
        status: 'PASSED',
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data
      });
      testResults.phases[phaseName].passed++;
      testResults.summary.passed++;
      console.log(`  ✅ ${name} - PASSED`);
      
    } catch (error) {
      // Failure
      const errorInfo = {
        name,
        status: 'FAILED',
        error: error.message,
        response: error.response?.data
      };
      
      testResults.phases[phaseName].tests.push(errorInfo);
      testResults.phases[phaseName].failed++;
      testResults.summary.failed++;
      testResults.summary.errors.push({
        phase: phaseName,
        test: name,
        error: error.message
      });
      
      console.log(`  ❌ ${name} - FAILED: ${error.message}`);
    }
  }

  // Setup test data
  async setupTestData() {
    console.log('📦 Setting up test data...');
    
    // Test data for BOM creation
    this.testData = {
      productStyles: [
        { id: '1', name: 'áo thun nam', code: 'TSH001' },
        { id: '2', name: 'áo khoác', code: 'JCK001' }
      ],
      
      items: [
        { id: '1', name: 'Vải cotton', sku: 'FAB001', itemType: 'FABRIC', baseUom: 'm' },
        { id: '2', name: 'Kim chỉ', sku: 'ACC001', itemType: 'ACCESSORY', baseUom: 'cuộn' },
        { id: '3', name: 'Nút áo', sku: 'ACC002', itemType: 'ACCESSORY', baseUom: 'cái' },
        { id: '4', name: 'Túi nilon', sku: 'PKG001', itemType: 'PACKING', baseUom: 'cái' }
      ],
      
      bomTemplates: {
        simpleShirt: {
          name: 'Template áo thun cơ bản',
          code: 'TEMP001',
          description: 'Template cho áo thun cơ bản',
          category: 'shirt',
          templateData: {
            lines: [
              {
                itemId: '1', // Vải cotton
                uom: 'm',
                qtyPerUnit: '1.5',
                wastagePercent: '5',
                note: 'Vải chính cho thân áo',
                isOptional: false,
                leadTimeDays: 7
              },
              {
                itemId: '2', // Kim chỉ
                uom: 'cuộn',
                qtyPerUnit: '0.1',
                wastagePercent: '0',
                note: 'Kim chỉ may áo',
                isOptional: false,
                leadTimeDays: 3
              },
              {
                itemId: '3', // Nút áo
                uom: 'cái',
                qtyPerUnit: '5',
                wastagePercent: '2',
                note: 'Nút cổ tay',
                isOptional: true,
                leadTimeDays: 5
              },
              {
                itemId: '4', // Túi nilon
                uom: 'cái',
                qtyPerUnit: '1',
                wastagePercent: '0',
                note: 'Túi đóng gói',
                isOptional: false,
                leadTimeDays: 1
              }
            ]
          }
        }
      }
    };
    
    console.log('✅ Test data setup completed');
  }

  // Phase 1: Basic CRUD Testing
  async testBasicCrud() {
    const tests = [
      // List BOMs
      {
        name: 'GET /boms - List all BOMs',
        method: 'GET',
        url: '/boms',
        data: { page: 1, pageSize: 10 },
        expectedStatus: 200,
        description: 'List all BOMs with pagination'
      },
      
      // List BOMs with filters
      {
        name: 'GET /boms - List BOMs with search',
        method: 'GET', 
        url: '/boms',
        data: { q: 'áo', page: 1, pageSize: 10 },
        expectedStatus: 200,
        description: 'Search BOMs by name/code'
      },
      
      // Get specific BOM (assuming ID 1 exists)
      {
        name: 'GET /boms/1 - Get specific BOM',
        method: 'GET',
        url: '/boms/1',
        expectedStatus: 200,
        description: 'Get BOM details with lines'
      }
    ];

    await this.testPhase('Phase 1: Basic CRUD Operations', tests);
  }

  // Phase 2: Enhanced Features Testing  
  async testEnhancedFeatures() {
    const tests = [
      // BOM Explosion
      {
        name: 'GET /boms/1/explode - BOM Explosion (100 units)',
        method: 'GET',
        url: '/boms/1/explode',
        data: { quantity: 100 },
        expectedStatus: 200,
        description: 'Explode BOM to get material requirements for 100 units'
      },
      
      {
        name: 'GET /boms/1/explode - BOM Explosion (1 unit)',
        method: 'GET',
        url: '/boms/1/explode', 
        data: { quantity: 1 },
        expectedStatus: 200,
        description: 'Explode BOM to get material requirements for 1 unit'
      },
      
      // BOM Costing
      {
        name: 'GET /boms/1/cost - BOM Cost Calculation',
        method: 'GET',
        url: '/boms/1/cost',
        data: { quantity: 100 },
        expectedStatus: 200,
        description: 'Calculate BOM cost for 100 units'
      },
      
      // BOM Lead Time
      {
        name: 'GET /boms/1/lead-time - BOM Lead Time',
        method: 'GET',
        url: '/boms/1/lead-time',
        expectedStatus: 200,
        description: 'Calculate BOM lead time'
      }
    ];

    await this.testPhase('Phase 2: Enhanced BOM Features', tests);
  }

  // Phase 3: Versioning System Testing
  async testVersioning() {
    const tests = [
      // Get current version
      {
        name: 'GET /boms/1/current-version - Get Current Version',
        method: 'GET',
        url: '/boms/1/current-version',
        expectedStatus: 200,
        description: 'Get current BOM version'
      },
      
      // Create new version
      {
        name: 'POST /boms/1/versions - Create New Version',
        method: 'POST',
        url: '/boms/1/versions',
        data: {
          versionNo: 'V2.0',
          description: 'Updated BOM with new materials',
          effectiveFrom: new Date().toISOString(),
          createdById: '1'
        },
        expectedStatus: 200,
        description: 'Create new BOM version'
      },
      
      // Submit for approval
      {
        name: 'POST /versions/1/submit-approval - Submit for Approval',
        method: 'POST',
        url: '/versions/1/submit-approval',
        data: {
          approvers: ['1', '2']
        },
        expectedStatus: 200,
        description: 'Submit BOM version for approval'
      },
      
      // Approve version
      {
        name: 'POST /versions/1/approve - Approve Version',
        method: 'POST', 
        url: '/versions/1/approve',
        data: {
          comments: 'Approved for production use'
        },
        expectedStatus: 200,
        description: 'Approve BOM version'
      }
    ];

    await this.testPhase('Phase 3: BOM Versioning System', tests);
  }

  // Phase 4: Templates Testing
  async testTemplates() {
    const tests = [
      // List templates
      {
        name: 'GET /boms/templates - List Templates',
        method: 'GET',
        url: '/boms/templates',
        data: { page: 1, pageSize: 10 },
        expectedStatus: 200,
        description: 'List all BOM templates'
      },
      
      // Create template
      {
        name: 'POST /boms/templates - Create Template',
        method: 'POST',
        url: '/boms/templates',
        data: this.testData.bomTemplates.simpleShirt,
        expectedStatus: 200,
        description: 'Create BOM template'
      },
      
      // Get specific template
      {
        name: 'GET /boms/templates/1 - Get Template',
        method: 'GET',
        url: '/boms/templates/1',
        expectedStatus: 200,
        description: 'Get specific template details'
      },
      
      // Create BOM from template
      {
        name: 'POST /templates/1/create-bom - Create BOM from Template',
        method: 'POST',
        url: '/templates/1/create-bom',
        data: {
          code: 'BOM-TEST-001',
          productStyleId: '1',
          name: 'BOM từ Template',
          isActive: true
        },
        expectedStatus: 200,
        description: 'Create BOM from template'
      }
    ];

    await this.testPhase('Phase 4: BOM Templates', tests);
  }

  // Phase 5: Error Handling & Edge Cases
  async testErrorHandling() {
    const tests = [
      // Invalid BOM ID
      {
        name: 'GET /boms/99999 - Invalid BOM ID',
        method: 'GET',
        url: '/boms/99999',
        expectedStatus: 404,
        description: 'Test 404 error for non-existent BOM'
      },
      
      // Invalid query parameters
      {
        name: 'GET /boms - Invalid page size',
        method: 'GET',
        url: '/boms',
        data: { page: 0, pageSize: 1000 },
        expectedStatus: 400,
        description: 'Test validation errors'
      },
      
      // Invalid explode parameters
      {
        name: 'GET /boms/1/explode - Invalid quantity',
        method: 'GET',
        url: '/boms/1/explode',
        data: { quantity: -1 },
        expectedStatus: 400,
        description: 'Test negative quantity validation'
      }
    ];

    await this.testPhase('Phase 5: Error Handling & Edge Cases', tests);
  }

  // Generate comprehensive report
  generateReport() {
    testResults.endTime = new Date().toISOString();
    
    console.log('\n📊 BOM API Test Results Summary');
    console.log('=====================================');
    console.log(`Total Tests: ${testResults.summary.total}`);
    console.log(`✅ Passed: ${testResults.summary.passed}`);
    console.log(`❌ Failed: ${testResults.summary.failed}`);
    console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
    
    // Save detailed results
    const reportPath = path.join(RESULTS_PATH, `bom-test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Generate HTML report
    this.generateHtmlReport(reportPath);
  }

  generateHtmlReport(jsonPath) {
    const htmlPath = jsonPath.replace('.json', '.html');
    const results = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>BOM API Test Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
            .summary { display: flex; gap: 20px; margin: 20px 0; }
            .metric { background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; text-align: center; }
            .passed { color: #28a745; }
            .failed { color: #dc3545; }
            .phase { margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
            .phase-header { background: #007bff; color: white; padding: 10px; }
            .test { padding: 10px; border-bottom: 1px solid #eee; }
            .test:last-child { border-bottom: none; }
            .error { background: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>BOM API Test Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <div class="summary">
                <div class="metric">
                    <h3>${results.summary.total}</h3>
                    <p>Total Tests</p>
                </div>
                <div class="metric">
                    <h3 class="passed">${results.summary.passed}</h3>
                    <p>Passed</p>
                </div>
                <div class="metric">
                    <h3 class="failed">${results.summary.failed}</h3>
                    <p>Failed</p>
                </div>
                <div class="metric">
                    <h3>${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%</h3>
                    <p>Success Rate</p>
                </div>
            </div>
        </div>
    `;

    // Add phase details
    Object.entries(results.phases).forEach(([phaseName, phase]) => {
      html += `
        <div class="phase">
            <div class="phase-header">
                <h2>${phaseName}</h2>
                <p>Passed: ${phase.passed} | Failed: ${phase.failed}</p>
            </div>
      `;
      
      phase.tests.forEach(test => {
        const statusClass = test.status === 'PASSED' ? 'passed' : 'failed';
        html += `
          <div class="test">
            <strong>${test.name}</strong>
            <span class="${statusClass}"> - ${test.status}</span>
            ${test.error ? `<div class="error">Error: ${test.error}</div>` : ''}
          </div>
        `;
      });
      
      html += '</div>';
    });

    html += '</body></html>';
    
    fs.writeFileSync(htmlPath, html);
    console.log(`📊 HTML report generated: ${htmlPath}`);
  }

  // Main test runner
  async runAllTests() {
    try {
      console.log('🚀 Starting Comprehensive BOM API Testing');
      console.log('==========================================');
      
      await this.setupTestData();
      await this.testBasicCrud();
      await this.testEnhancedFeatures();
      await this.testVersioning();
      await this.testTemplates();
      await this.testErrorHandling();
      
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    }
  }
}

// Run tests
if (require.main === module) {
  const tester = new BomApiTester();
  tester.runAllTests().then(() => {
    console.log('🎉 All tests completed!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = BomApiTester;
