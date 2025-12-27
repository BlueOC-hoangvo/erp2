/**
 * Test authentication và các endpoints cần auth
 */
const axios = require('axios');

const API_BASE = 'http://localhost:4000';

async function testAuthEndpoints() {
  console.log('🧪 AUTHENTICATION & PROTECTED ENDPOINTS TEST');
  console.log('============================================');
  
  // Test 1: Check auth endpoint directly
  try {
    console.log('\n🔐 Testing /auth/login endpoint...');
    const authResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@erp.local',
      password: 'Admin@123'
    });
    console.log('✅ Auth endpoint works! Status:', authResponse.status);
    console.log('Response keys:', Object.keys(authResponse.data));
    console.log('Data keys:', Object.keys(authResponse.data.data || {}));
    
    if (authResponse.data.data && authResponse.data.data.accessToken) {
      const token = authResponse.data.data.accessToken;
      console.log('Token obtained:', token.substring(0, 50) + '...');
      
      // Test 2: Use token to create BOM
      console.log('\n📝 Testing POST /boms with auth...');
      const createBomResponse = await axios.post(`${API_BASE}/boms`, {
        code: "BOM-TEST-AUTH",
        productStyleId: "1",
        name: "Test BOM with Auth",
        isActive: true,
        lines: [
          {
            itemId: "1",
            uom: "m",
            qtyPerUnit: "1.5",
            wastagePercent: "10.0"
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Create BOM with auth works! Status:', createBomResponse.status);
      console.log('Created BOM ID:', createBomResponse.data.data.id);
      
      const createdBomId = createBomResponse.data.data.id;
      
      // Test 3: Test template creation with auth
      console.log('\n📄 Testing POST /boms/templates with auth...');
      const createTemplateResponse = await axios.post(`${API_BASE}/boms/templates`, {
        name: "Test Template Auth",
        code: "TPL-AUTH-001",
        description: "Test template creation with auth",
        category: "TEST",
        templateData: {
          lines: [
            {
              itemId: "1",
              uom: "m",
              qtyPerUnit: "1.0",
              wastagePercent: "5.0"
            }
          ]
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Create template with auth works! Status:', createTemplateResponse.status);
      
      // Test 4: Test versioning endpoints
      console.log('\n🔄 Testing BOM versioning with auth...');
      
      // Create version
      const createVersionResponse = await axios.post(`${API_BASE}/boms/${createdBomId}/versions`, {
        versionNo: "2.0",
        description: "Test version creation",
        createdById: "1"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Create version works! Status:', createVersionResponse.status);
      console.log('Created version ID:', createVersionResponse.data.data.id);
      
      // Submit for approval
      const versionId = createVersionResponse.data.data.id;
      const submitApprovalResponse = await axios.post(`${API_BASE}/boms/versions/${versionId}/submit-approval`, {
        approvers: ["1", "2"]
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Submit approval works! Status:', submitApprovalResponse.status);
      
      // Approve version
      const approveResponse = await axios.post(`${API_BASE}/boms/versions/${versionId}/approve`, {
        comments: "Approved for testing"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Approve version works! Status:', approveResponse.status);
      
    } else {
      console.log('❌ No accessToken in response');
    }
    
  } catch (error) {
    console.log('❌ Auth test failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
  
  // Test 5: Test update and delete (sẽ cần BOM ID thực tế)
  console.log('\n✏️ Testing update/delete endpoints...');
  
  try {
    // Update BOM (cần có BOM thực tế)
    const updateResponse = await axios.put(`${API_BASE}/boms/36`, {
      name: "Updated BOM Name",
      isActive: false
    }, {
      headers: {
        'Authorization': 'Bearer dummy-token', // Sẽ fail với 401
        'Content-Type': 'application/json'
      }
    });
    
    console.log('❌ Update should have failed with auth error');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Update correctly requires authentication (401)');
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
  
  console.log('\n🎉 Auth testing completed!');
}

testAuthEndpoints().catch(console.error);
