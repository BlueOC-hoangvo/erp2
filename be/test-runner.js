#!/usr/bin/env node

/**
 * BOM + Production API Test Runner
 * 
 * Script để test và demonstrate BOM + Production Order integration
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 BOM + Production Order API Test Runner\n');

// Check if server is running
async function checkServer() {
  return new Promise((resolve) => {
    console.log('🔍 Checking if server is running on http://localhost:3000...');
    
    const test = spawn('curl', ['-s', 'http://localhost:3000/api/health'], {
      stdio: 'pipe'
    });

    test.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Server is running!\n');
        resolve(true);
      } else {
        console.log('❌ Server is not running.\n');
        console.log('💡 To start the server, run: npm start');
        resolve(false);
      }
    });

    test.on('error', () => {
      console.log('❌ Server is not running.\n');
      console.log('💡 To start the server, run: npm start');
      resolve(false);
    });
  });
}

// Run simple API tests
async function runSimpleTests() {
  console.log('🚀 Running Simple API Tests...\n');
  
  try {
    const testScript = path.join(__dirname, 'test-simple-api.js');
    
    if (!fs.existsSync(testScript)) {
      console.log('❌ test-simple-api.js not found');
      return;
    }

    const child = spawn('node', [testScript], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      console.log(`\n📊 Simple tests completed with exit code: ${code}`);
    });

  } catch (error) {
    console.error('❌ Error running simple tests:', error);
  }
}

// Run integration tests
async function runIntegrationTests() {
  console.log('🚀 Running Full Integration Tests...\n');
  
  try {
    const testScript = path.join(__dirname, 'test-bom-production-integration.js');
    
    if (!fs.existsSync(testScript)) {
      console.log('❌ test-bom-production-integration.js not found');
      return;
    }

    const child = spawn('node', [testScript], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      console.log(`\n📊 Integration tests completed with exit code: ${code}`);
    });

  } catch (error) {
    console.error('❌ Error running integration tests:', error);
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('\n🔧 Setup Instructions:');
    console.log('1. Start the server: npm start');
    console.log('2. In another terminal, run: node test-runner.js');
    console.log('\n📁 Available test files:');
    console.log('   • test-simple-api.js - Basic API tests');
    console.log('   • test-bom-production-integration.js - Full integration tests');
    return;
  }

  console.log('🧪 Choose test type:');
  console.log('1. Simple API Tests (fast, basic endpoints)');
  console.log('2. Full Integration Tests (complete BOM + Production flow)');
  console.log('3. Both');
  
  const args = process.argv.slice(2);
  const choice = args[0] || '1';

  switch (choice) {
    case '1':
      await runSimpleTests();
      break;
    case '2':
      await runIntegrationTests();
      break;
    case '3':
      await runSimpleTests();
      console.log('\n' + '='.repeat(50));
      await runIntegrationTests();
      break;
    default:
      console.log('Invalid choice, running simple tests...');
      await runSimpleTests();
  }
}

// Help message
function showHelp() {
  console.log('📚 BOM + Production Order Test Runner\n');
  console.log('Usage: node test-runner.js [option]\n');
  console.log('Options:');
  console.log('  1       Run simple API tests (default)');
  console.log('  2       Run full integration tests');
  console.log('  3       Run both simple and integration tests');
  console.log('  help    Show this help message\n');
  console.log('Examples:');
  console.log('  node test-runner.js');
  console.log('  node test-runner.js 2');
  console.log('  node test-runner.js 3');
}

// Check for help flag
const args = process.argv.slice(2);
if (args.includes('help') || args.includes('-h') || args.includes('--help')) {
  showHelp();
  process.exit(0);
}

// Run main
main().catch(console.error);
