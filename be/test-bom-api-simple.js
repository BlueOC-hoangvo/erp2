const http = require('http');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:4000';
const RESULTS_PATH = path.join(__dirname, 'test-results');

// Ensure results directory exists
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

// HTTP request helper
function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url, BASE_URL);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test runner class
class BomApiTester {
  constructor() {
    this.testData = {
      bomTemplates: {
        simpleShirt: {
          name: 'Template áo thun cơ bản',
          code: 'TEMP001',
          description: 'Template cho áo thun cơ bản',
          category: 'shirt',
          templateData: {
            lines: [
              {
                itemId: '1',
                uom: 'm',
                qtyPerUnit: '1.5',
                wastagePercent: '5',
                note: 'Vải chính cho thân áo',
                isOptional: false,
                leadTimeDays: 7
              }
            ]
          }
        }
      }
    };
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
      
      const response = await makeRequest(method, url, data);

      if (expectedStatus && response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
      }

      // Success
      testResults.phases[phaseName].tests.push({
        name,
        status: 'PASSED',
        responseTime: 'N/A',
        data: response.data
      });
      testResults.phases[phaseName].passed++;
      testResults.summary.passed++;
      console.log(`  ✅ ${name} - PASSED (${response.status})`);
      
    } catch (error) {
      // Failure
      const errorInfo = {
        name,
        status: 'FAILED',
        error: error.message,
        response: null
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

  // Phase 1: Basic CRUD Testing
  async testBasicCrud() {
    const tests = [
      // List BOMs
      {
        name: 'GET /boms - List all BOMs',
        method: 'GET',
        url: '/boms?page=1&pageSize=10',
        expectedStatus: 200,
        description: 'List all BOMs with pagination'
      },
      
      // List BOMs with filters
      {
        name: 'GET /boms - List BOMs with search',
        method: 'GET', 
        url: '/boms?q=áo&page=1&pageSize=10',
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
        url: '/boms/1/explode?quantity=100',
        expectedStatus: 200,
        description: 'Explode BOM to get material requirements for 100 units'
      },
      
      {
        name: 'GET /boms/1/explode - BOM Explosion (1 unit)',
        method: 'GET',
        url: '/boms/1/explode?quantity=1',
        expectedStatus: 200,
        description: 'Explode BOM to get material requirements for 1 unit'
      },
      
      // BOM Costing
      {
        name: 'GET /boms/1/cost - BOM Cost Calculation',
        method: 'GET',
        url: '/boms/1/cost?quantity=100',
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
        url: '/boms/templates?page=1&pageSize=10',
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
        url: '/boms?page=0&pageSize=1000',
        expectedStatus: 400,
        description: 'Test validation errors'
      },
      
      // Invalid explode parameters
      {
        name: 'GET /boms/1/explode - Invalid quantity',
        method: 'GET',
        url: '/boms/1/explode?quantity=-1',
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
    
    // Generate summary HTML report
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
            body { font-family: Arial, sans-serif; margin: 20px; background: #f8f9fa; }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
            .metric { background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .metric h3 { margin: 0; font-size: 2.5em; }
            .metric p { margin: 10px 0 0 0; color: #666; font-weight: 500; }
            .passed { color: #28a745; }
            .failed { color: #dc3545; }
            .phase { margin: 30px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .phase-header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; }
            .phase-header h2 { margin: 0; }
            .phase-stats { opacity: 0.9; margin-top: 5px; }
            .test { padding: 15px 20px; background: white; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
            .test:last-child { border-bottom: none; }
            .test-name { font-weight: 500; }
            .test-status { font-weight: bold; }
            .error { background: #f8d7da; color: #721c24; padding: 15px; margin: 10px 20px; border-radius: 5px; border-left: 4px solid #dc3545; }
            .footer { text-align: center; margin-top: 40px; padding: 20px; background: white; border-radius: 10px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 BOM API Test Report</h1>
                <p>Generated: ${new Date().toLocaleString()}</p>
                <p>Comprehensive testing of BOM system APIs</p>
            </div>
            
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
    `;

    // Add phase details
    Object.entries(results.phases).forEach(([phaseName, phase]) => {
      html += `
        <div class="phase">
            <div class="phase-header">
                <h2>${phaseName}</h2>
                <div class="phase-stats">
                    ✅ Passed: ${phase.passed} | ❌ Failed: ${phase.failed} | Success: ${((phase.passed / (phase.passed + phase.failed)) * 100).toFixed(1)}%
                </div>
            </div>
      `;
      
      phase.tests.forEach(test => {
        const statusClass = test.status === 'PASSED' ? 'passed' : 'failed';
        const statusIcon = test.status === 'PASSED' ? '✅' : '❌';
        html += `
          <div class="test">
            <div class="test-name">${test.name}</div>
            <div class="test-status ${statusClass}">${statusIcon} ${test.status}</div>
            ${test.error ? `<div class="error">Error: ${test.error}</div>` : ''}
          </div>
        `;
      });
      
      html += '</div>';
    });

    html += `
            <div class="footer">
                <p>🎯 Test completed successfully! Review results above for detailed analysis.</p>
                <p>💡 Check individual test results to identify any issues that need attention.</p>
            </div>
        </div>
    </body>
    </html>`;
    
    fs.writeFileSync(htmlPath, html);
    console.log(`📊 HTML report generated: ${htmlPath}`);
  }

  // Main test runner
  async runAllTests() {
    try {
      console.log('🚀 Starting Comprehensive BOM API Testing');
      console.log('==========================================');
      
      // Wait a moment for server to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
