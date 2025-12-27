const http = require('http');

// Create a debug version to see exactly what's being validated
function createDebugRequest() {
  console.log('🔍 Creating detailed validation debug...\n');

  // Let's test the exact route that should work
  console.log('Testing /boms/templates route...');
  
  // Check what happens when we call it
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/boms/templates',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Full Response:');
      console.log('Status:', res.statusCode);
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      console.log('Body:', body);
      
      try {
        const parsed = JSON.parse(body);
        if (parsed.error?.details) {
          console.log('\nValidation Details:');
          console.log('Form Errors:', parsed.error.details.formErrors);
          console.log('Field Errors:', parsed.error.details.fieldErrors);
        }
      } catch (e) {
        console.log('Could not parse JSON:', e.message);
      }
    });
  });

  req.on('error', (err) => {
    console.error('Request error:', err);
  });

  req.end();
}

createDebugRequest();
