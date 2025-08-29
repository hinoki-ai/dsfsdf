#!/usr/bin/env node

/**
 * Environment Validation Script for Liquor Store
 * Checks if all required environment variables are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Validation for Liquor Store\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Create it by copying from env.example:');
  console.log('   cp env.example .env.local\n');
  process.exit(1);
}

// Read environment file
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log('📋 Checking critical environment variables...\n');

const criticalVars = [
  {
    name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    pattern: /^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.+$/,
    placeholder: 'pk_test_placeholder',
    description: 'Clerk Publishable Key (from dashboard.clerk.com)'
  },
  {
    name: 'CLERK_SECRET_KEY',
    pattern: /^CLERK_SECRET_KEY=.+$/,
    placeholder: 'sk_test_placeholder',
    description: 'Clerk Secret Key (from dashboard.clerk.com)'
  }
];

let allValid = true;

criticalVars.forEach(varConfig => {
  const line = envLines.find(line => varConfig.pattern.test(line));

  if (!line) {
    console.log(`❌ ${varConfig.name} - MISSING`);
    console.log(`   ${varConfig.description}\n`);
    allValid = false;
    return;
  }

  const value = line.split('=')[1];

  if (!value || value === varConfig.placeholder) {
    console.log(`❌ ${varConfig.name} - PLACEHOLDER VALUE DETECTED`);
    console.log(`   Current: ${value}`);
    console.log(`   ${varConfig.description}\n`);
    allValid = false;
  } else {
    console.log(`✅ ${varConfig.name} - OK`);
  }
});

// Check optional but important variables
console.log('\n📋 Checking optional environment variables...\n');

const optionalVars = [
  { name: 'NEXT_PUBLIC_CONVEX_URL', pattern: /^NEXT_PUBLIC_CONVEX_URL=.+$/ },
  { name: 'NODE_ENV', pattern: /^NODE_ENV=.+$/ },
  { name: 'NEXT_PUBLIC_APP_URL', pattern: /^NEXT_PUBLIC_APP_URL=.+$/ }
];

optionalVars.forEach(varConfig => {
  const line = envLines.find(line => varConfig.pattern.test(line));
  if (line) {
    console.log(`✅ ${varConfig.name} - Set`);
  } else {
    console.log(`⚠️  ${varConfig.name} - Not set (optional)`);
  }
});

console.log('\n' + '='.repeat(60));

if (allValid) {
  console.log('🎉 All critical environment variables are properly configured!');
  console.log('🚀 Your middleware should work correctly now.');
  console.log('\n💡 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Run: npm run start');
  console.log('   3. Test your application');
} else {
  console.log('❌ Environment validation FAILED!');
  console.log('\n🔧 To fix:');
  console.log('   1. Go to https://dashboard.clerk.com');
  console.log('   2. Get your Publishable Key and Secret Key');
  console.log('   3. Update .env.local with real values');
  console.log('   4. Run this script again: node validate-env.js');
  console.log('\n📖 See MIDDLEWARE_FIX_README.md for detailed instructions');
}

console.log('\n' + '='.repeat(60) + '\n');