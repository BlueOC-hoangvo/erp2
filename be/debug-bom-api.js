const http = require('http');

// Debug specific endpoint that returns 500
function debugCurrentVersion() {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/boms/1/current-version',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log('🔍 Debugging GET /boms/1/current-version endpoint...');

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      console.log('Headers:', res.headers);
      console.log('Body:', body);
      
      if (res.statusCode === 500) {
        console.log('\n❌ 500 Server Error detected');
        console.log('This indicates a server-side bug that needs fixing');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.end();
}

// Test missing endpoint
function testMissingEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/boms/versions/1/submit-approval',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token'
    }
  };

  console.log('\n🔍 Testing POST /boms/versions/1/submit-approval endpoint...');

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      console.log('Body:', body);
      
      if (res.statusCode === 404) {
        console.log('\n❌ 404 Not Found - Endpoint not implemented');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.write(JSON.stringify({ approvers: ['1', '2'] }));
  req.end();
}

// Test template validation
function testTemplateValidation() {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/boms/templates',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log('\n🔍 Testing GET /boms/templates endpoint...');

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      console.log('Body:', body);
      
      if (res.statusCode === 400) {
        console.log('\n❌ 400 Bad Request - DTO validation issue');
        console.log('Need to fix bomTemplateQueryDto validation');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.end();
}

console.log('🚀 Starting BOM API Debugging...\n');

// Run debug tests
debugCurrentVersion();

setTimeout(() => {
  testMissingEndpoint();
}, 1000);

setTimeout(() => {
  testTemplateValidation();
}, 2000);

console.log('\n📝 Debug tests started. Check console output above.');
