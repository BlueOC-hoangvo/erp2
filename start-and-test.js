// Debug script để khởi động backend và test API
const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting ERP Backend Server...');

// Khởi động backend server
const backend = spawn('npm', ['run', 'dev'], {
  cwd: './be',
  stdio: 'inherit',
  shell: true
});

// Đợi server khởi động
setTimeout(() => {
  console.log('✅ Testing API endpoint...');
  
  const data = JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Response: ${body}`);
    });
  });

  req.on('error', (e) => {
    console.error(`❌ API Error: ${e.message}`);
  });

  req.write(data);
  req.end();

}, 5000);

// Xử lý exit
process.on('SIGINT', () => {
  console.log('🛑 Stopping server...');
  backend.kill();
  process.exit(0);
});
