#!/bin/bash
echo "=== ERP SYSTEM TESTING ==="
echo

echo "1. Testing Backend Health..."
curl -s http://localhost:4000/health
echo
echo

echo "2. Testing Products API (without auth)..."
curl -s http://localhost:4000/products
echo
echo

echo "3. Testing Auth API..."
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@erp.local","password":"Admin@123"}'
echo
echo

echo "=== STATUS ==="
echo "Frontend: http://localhost:5173/ (React + Vite)"
echo "Backend:  http://localhost:4000/ (Express + TypeScript)"
echo "Database: MySQL (erp_base)"
echo "Admin: admin@erp.local / Admin@123"
echo
