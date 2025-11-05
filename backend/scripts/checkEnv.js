import { config } from '../config/config.js';

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'MONGODB_URI',
  'FRONTEND_URL'
];

const optionalButRecommended = [
  'PINATA_API_KEY',
  'PINATA_SECRET_API_KEY',
  'GOOGLE_AI_API_KEY'
];

console.log('🔍 Checking environment variables...\n');

// Check required variables
console.log('✅ Required variables:');
let allRequiredVarsPresent = true;

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    allRequiredVarsPresent = false;
  } else {
    console.log(`   ${varName} = ${varName.includes('SECRET') || varName.includes('KEY') ? '********' : process.env[varName]}`);
  }
});

// Check recommended variables
console.log('\nℹ️  Recommended variables:');
optionalButRecommended.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`   ⚠️  ${varName} is not set (functionality may be limited)`);
  } else {
    console.log(`   ✅ ${varName} = ********`);
  }
});

// Check if using default JWT secret
if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
  console.log('\n⚠️  WARNING: Using default JWT_SECRET. Please change this in production!');
}

// Check if using default admin credentials
if (process.env.ADMIN_PASSWORD === 'ChangeThisPassword123!') {
  console.log('⚠️  WARNING: Using default admin password. Please change ADMIN_PASSWORD in production!');
}

// Final check
if (!allRequiredVarsPresent) {
  console.error('\n❌ Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

console.log('\n✅ Environment check completed successfully!');
process.exit(0);
