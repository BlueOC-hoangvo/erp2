// Simple test script
const http = require('http');

function testLogin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'admin@erp.local',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('Login Response:', res.statusCode, data);
        try {
          const parsed = JSON.parse(data);
          if (parsed.data && parsed.data.accessToken) {
            resolve(parsed.data.accessToken);
          } else {
            reject(new Error('Login failed: ' + JSON.stringify(parsed)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

function testSalesOrders(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/sales-orders?page=1&limit=20',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('Sales Orders Response:', res.statusCode, data);
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

async function runTest() {
  try {
    console.log('🧪 Testing API...');
    
    // Test login
    const token = await testLogin();
    console.log('✅ Login successful');
    
    // Test sales orders
    const result = await testSalesOrders(token);
    console.log('✅ Sales orders API working!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

runTest();
