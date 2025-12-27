const http = require('http');

// Test individual endpoints to isolate issues
function testEndpoint(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runDiagnostics() {
  console.log('🔍 BOM API Diagnostic Tests\n');

  // Test 1: Current version endpoint (500 error)
  console.log('1️⃣ Testing GET /boms/1/current-version (500 error)...');
  try {
    const result = await testEndpoint('GET', '/boms/1/current-version');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${result.body}`);
  } catch (error) {
    console.error(`   Error: ${error.message}`);
  }

  // Test 2: Templates list endpoint (400 error)
  console.log('\n2️⃣ Testing GET /boms/templates (400 error)...');
  try {
    const result = await testEndpoint('GET', '/boms/templates');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${result.body}`);
  } catch (error) {
    console.error(`   Error: ${error.message}`);
  }

  // Test 3: Templates list with pagination
  console.log('\n3️⃣ Testing GET /boms/templates?page=1&pageSize=10...');
  try {
    const result = await testEndpoint('GET', '/boms/templates?page=1&pageSize=10');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${result.body}`);
  } catch (error) {
    console.error(`   Error: ${error.message}`);
  }

  // Test 4: Templates list with search
  console.log('\n4️⃣ Testing GET /boms/templates?q=test...');
  try {
    const result = await testEndpoint('GET', '/boms/templates?q=test');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${result.body}`);
  } catch (error) {
    console.error(`   Error: ${error.message}`);
  }

  // Test 5: Get specific BOM (should work)
  console.log('\n5️⃣ Testing GET /boms/1 (should work)...');
  try {
    const result = await testEndpoint('GET', '/boms/1');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response length: ${result.body.length} chars`);
  } catch (error) {
    console.error(`   Error: ${error.message}`);
  }

  // Test 6: Get template by ID (should fail with 404)
  console.log('\n6️⃣ Testing GET /boms/templates/1...');
  try {
    const result = await testEndpoint('GET', '/boms/templates/1');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${result.body}`);
  } catch (error) {
    console.error(`   Error: ${error.message}`);
  }

  console.log('\n✅ Diagnostic tests completed!');
  console.log('\n📝 Analysis:');
  console.log('- If endpoints work individually but fail in test suite,');
  console.log('  there might be async/timing issues');
  console.log('- Check server logs for detailed error messages');
  console.log('- 500 errors indicate server-side bugs that need fixing');
  console.log('- 400 errors indicate DTO validation issues');
}

runDiagnostics().catch(console.error);
