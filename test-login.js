async function testLogin() {
  try {
    console.log('🧪 Testing Login API...');
    
    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@erp.local',
        password: 'Admin@123'
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.data && data.data.accessToken) {
      console.log('\n✅ Login successful!');
      console.log('Access Token:', data.data.accessToken ? '✅ Received' : '❌ Missing');
      console.log('Refresh Token:', data.data.refreshToken ? '✅ Received' : '❌ Missing');
    } else {
      console.log('\n❌ Login failed!');
      if (data.error) {
        console.log('Error:', data.error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Network error!');
    console.error('Error:', error.message);
  }
}

testLogin();
