# BOM API Test Script - PowerShell Version
Write-Host "🚀 Starting BOM API Testing..." -ForegroundColor Green
Write-Host "=" * 60

$baseUrl = "http://localhost:4000"
$passed = 0
$failed = 0
$total = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Data = "",
        [int]$ExpectedStatus = 200
    )
    
    $total++
    Write-Host "`n🔍 Test $total`: $Name" -ForegroundColor Yellow
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri "$baseUrl$Url" -Method GET -ErrorAction Stop
            $statusCode = 200
        } else {
            $headers = @{ "Content-Type" = "application/json" }
            $response = Invoke-RestMethod -Uri "$baseUrl$Url" -Method $Method -Headers $headers -Body $Data -ErrorAction Stop
            $statusCode = 201
        }
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ PASS - Status: $statusCode" -ForegroundColor Green
            $passed++
            return $true
        } else {
            Write-Host "   ❌ FAIL - Expected: $ExpectedStatus, Got: $statusCode" -ForegroundColor Red
            $failed++
            return $false
        }
    }
    catch {
        Write-Host "   ❌ FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
        return $false
    }
}

# Phase 1: Basic CRUD Operations
Write-Host "`n📋 PHASE 1: Basic CRUD Operations" -ForegroundColor Cyan
Test-Endpoint "List BOMs" "GET" "/boms"
Test-Endpoint "List BOMs with pagination" "GET" "/boms?page=1&pageSize=10"
Test-Endpoint "Get specific BOM" "GET" "/boms/1"

# Phase 2: BOM Templates  
Write-Host "`n📋 PHASE 2: BOM Templates" -ForegroundColor Cyan
Test-Endpoint "List BOM Templates" "GET" "/boms/templates"
Test-Endpoint "List BOM Templates with pagination" "GET" "/boms/templates?page=1&pageSize=10"
Test-Endpoint "Get specific template" "GET" "/boms/templates/1"
Test-Endpoint "Get template 2" "GET" "/boms/templates/2"
Test-Endpoint "Get template 3" "GET" "/boms/templates/3"

# Phase 3: Enhanced BOM Features
Write-Host "`n📋 PHASE 3: Enhanced BOM Features" -ForegroundColor Cyan
Test-Endpoint "BOM Explosion" "GET" "/boms/1/explode?quantity=10"
Test-Endpoint "BOM Cost Calculation" "GET" "/boms/1/cost?quantity=10"
Test-Endpoint "BOM Lead Time" "GET" "/boms/1/lead-time"

# Phase 4: BOM Versioning
Write-Host "`n📋 PHASE 4: BOM Versioning" -ForegroundColor Cyan
Test-Endpoint "Get current version" "GET" "/boms/1/current-version"

# Phase 5: Error Handling
Write-Host "`n📋 PHASE 5: Error Handling" -ForegroundColor Cyan
Test-Endpoint "Get non-existent BOM" "GET" "/boms/999999"
Test-Endpoint "Get non-existent template" "GET" "/boms/templates/999999"

# Final Results
Write-Host "`n" + ("=" * 60)
Write-Host "📊 FINAL TEST RESULTS" -ForegroundColor Green
Write-Host ("=" * 60)

$successRate = [math]::Round(($passed / $total) * 100, 1)

Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red  
Write-Host "📊 Total: $total"
Write-Host "📈 Success Rate: $successRate%"

if ($failed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! BOM API is working perfectly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some tests failed. Check details above." -ForegroundColor Yellow
}

# Create summary report
$report = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    summary = @{
        total = $total
        passed = $passed
        failed = $failed
        successRate = "$successRate%"
    }
}

$report | ConvertTo-Json | Out-File -FilePath "final-bom-test-report.json" -Encoding UTF8
Write-Host "`n💾 Report saved to: final-bom-test-report.json"
