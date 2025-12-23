#!/bin/bash

# Test Backend API
echo "🔍 Testing Backend API..."

# Check if backend is running
echo "1️⃣ Checking if backend is running on port 4000..."
netstat -an | findstr :4000

# Test health endpoint
echo -e "\n2️⃣ Testing health endpoint..."
curl -s -w "HTTP Status: %{http_code}\n" http://localhost:4000/health || echo "Backend not responding"

# Test login endpoint (with default credentials)
echo -e "\n3️⃣ Testing login endpoint..."
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@erp.com","password":"admin123"}' || echo "Login endpoint not responding"

echo -e "\n✅ API test completed!"
