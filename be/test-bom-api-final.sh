#!/bin/bash

# BOM API Final Comprehensive Test
echo "🚀 Starting Comprehensive BOM API Testing..."
echo "="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0
total=0

run_test() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local expected="$5"
    
    total=$((total + 1))
    echo -e "\n🔍 Test $total: $name"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$method" "$BASE_URL$url")
    else
        response=$(curl -s -w "%{http_code}" -o /tmp/response.json -H "Content-Type: application/json" -d "$data" "$method" "$BASE_URL$url")
    fi
    
    if [ "$response" = "$expected" ]; then
        echo -e "   ${GREEN}✅ PASS${NC} - Status: $response"
        passed=$((passed + 1))
    else
        echo -e "   ${RED}❌ FAIL${NC} - Expected: $expected, Got: $response"
        echo "   📄 Response: $(cat /tmp/response.json | head -c 200)..."
        failed=$((failed + 1))
    fi
}

BASE_URL="http://localhost:4000"

# Phase 1: Basic CRUD Operations
echo -e "\n📋 PHASE 1: Basic CRUD Operations"
echo "-"

run_test "List BOMs" "GET" "/boms" "" "200"
run_test "List BOMs with pagination" "GET" "/boms?page=1&pageSize=10" "" "200"
run_test "Get specific BOM" "GET" "/boms/1" "" "200"

# Phase 2: BOM Templates  
echo -e "\n📋 PHASE 2: BOM Templates"
echo "-"

run_test "List BOM Templates" "GET" "/boms/templates" "" "200"
run_test "List BOM Templates with pagination" "GET" "/boms/templates?page=1&pageSize=10" "" "200"
run_test "Get specific template" "GET" "/boms/templates/1" "" "200"
run_test "Get template 2" "GET" "/boms/templates/2" "" "200"
run_test "Get template 3" "GET" "/boms/templates/3" "" "200"

# Phase 3: Enhanced BOM Features
echo -e "\n📋 PHASE 3: Enhanced BOM Features"
echo "-"

run_test "BOM Explosion" "GET" "/boms/1/explode?quantity=10" "" "200"
run_test "BOM Cost Calculation" "GET" "/boms/1/cost?quantity=10" "" "200"
run_test "BOM Lead Time" "GET" "/boms/1/lead-time" "" "200"

# Phase 4: BOM Versioning
echo -e "\n📋 PHASE 4: BOM Versioning"
echo "-"

run_test "Get current version" "GET" "/boms/1/current-version" "" "200"

# Phase 5: Error Handling
echo -e "\n📋 PHASE 5: Error Handling"
echo "-"

run_test "Get non-existent BOM" "GET" "/boms/999999" "" "404"
run_test "Get non-existent template" "GET" "/boms/templates/999999" "" "404"

# Final Results
echo -e "\n" "=" | tr ' ' '='
echo "📊 FINAL TEST RESULTS"
echo "=" | tr ' ' '='

success_rate=$((passed * 100 / total))

echo -e "✅ Passed: $passed"
echo -e "❌ Failed: $failed"  
echo -e "📊 Total: $total"
echo -e "📈 Success Rate: ${success_rate}%"

if [ $failed -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! BOM API is working perfectly!${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️ Some tests failed. Check details above.${NC}"
    exit 1
fi
