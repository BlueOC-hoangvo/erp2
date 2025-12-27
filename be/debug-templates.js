const http = require('http');

// Deep dive into templates validation issue
async function debugTemplates() {
  console.log('🔍 Deep debugging templates validation...\n');

  // Test 1: Simple query with no params
  await testEndpoint('GET', '/boms/templates', null, 'Test 1: No query params');

  // Test 2: Minimal query
  await testEndpoint('GET', '/boms/templates?page=1', null, 'Test 2: Minimal query');

  // Test 3: Full query
  await testEndpoint('GET', '/boms/templates?page=1&pageSize=10&q=test', null, 'Test 3: Full query');

  // Test 4: Compare with working endpoint
  await testEndpoint('GET', '/boms?page=1&pageSize=10', null, 'Test 4: Working BOMs endpoint');
}

function testEndpoint(method, path, data, description) {
  return new Promise((resolve, reject) => {
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
        console.log(`${description}:`);
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Response: ${body.substring(0, 200)}...`);
        
        if (res.statusCode === 400) {
          try {
            const parsed = JSON.parse(body);
            console.log(`  Validation errors:`, JSON.stringify(parsed.error?.details?.fieldErrors, null, 2));
          } catch (e) {
            console.log(`  Raw response: ${body}`);
          }
        }
        console.log('');
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

debugTemplates().catch(console.error);
