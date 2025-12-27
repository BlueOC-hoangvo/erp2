const http = require('http');

// Test route ordering by making requests with different patterns
async function testRouteOrdering() {
  console.log('🔍 Testing route ordering...\n');

  // Test 1: Query route should match first
  console.log('Test 1: /boms/templates (should use query DTO)');
  await makeRequest('/boms/templates', 'GET');
  
  console.log('\nTest 2: /boms/templates?page=1 (should use query DTO)');
  await makeRequest('/boms/templates?page=1', 'GET');
  
  console.log('\nTest 3: /boms/templates/1 (should use params DTO)');
  await makeRequest('/boms/templates/1', 'GET');
  
  // Let's also test a working route for comparison
  console.log('\nTest 4: /boms?page=1 (working route for comparison)');
  await makeRequest('/boms?page=1', 'GET');
}

function makeRequest(path, method) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`  Status: ${res.statusCode}`);
        
        try {
          const parsed = JSON.parse(body);
          if (parsed.error?.details?.fieldErrors?.id) {
            console.log(`  ❌ ID validation error: ${parsed.error.details.fieldErrors.id.join(', ')}`);
            console.log(`     This suggests params middleware is being applied incorrectly`);
          } else if (parsed.data) {
            console.log(`  ✅ Success - Got ${parsed.data.total || 'data'}`);
          } else {
            console.log(`  ❌ Error: ${parsed.error?.message || 'Unknown error'}`);
          }
        } catch (e) {
          console.log(`  Raw response: ${body.substring(0, 100)}...`);
        }
        
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`  ❌ Request error: ${err.message}`);
      resolve();
    });

    req.end();
  });
}

testRouteOrdering().catch(console.error);
