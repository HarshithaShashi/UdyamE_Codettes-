#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Udyami Web Deployment...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`📋 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed!`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed!`, 'red');
    return false;
  }
}

// Check if dependencies are installed
if (!fs.existsSync('node_modules')) {
  log('📦 Installing dependencies...', 'yellow');
  if (!runCommand('npm install', 'Installing dependencies')) {
    process.exit(1);
  }
}

// Build the web version
if (!runCommand('npm run build:web:static', 'Building web version')) {
  process.exit(1);
}

// Check if build was successful
if (!fs.existsSync('web-build')) {
  log('❌ Build failed - web-build directory not found', 'red');
  process.exit(1);
}

log('\n🎉 Build completed successfully!', 'green');
log('\n📁 Your web build is ready in the "web-build" folder', 'blue');
log('\n🌐 Deployment Options:', 'yellow');
log('1. Vercel (Recommended): npm run deploy:vercel', 'blue');
log('2. Netlify: Drag web-build folder to https://app.netlify.com/drop', 'blue');
log('3. Local testing: npm run serve:web', 'blue');
log('\n📖 See WEB_DEPLOYMENT.md for detailed instructions', 'blue');

// Ask if user wants to deploy to Vercel
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n🤔 Would you like to deploy to Vercel now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    log('\n🚀 Deploying to Vercel...', 'yellow');
    try {
      execSync('vercel --prod', { stdio: 'inherit' });
      log('\n🎉 Deployment completed! Check the URL provided above.', 'green');
    } catch (error) {
      log('\n❌ Vercel deployment failed. You can still deploy manually.', 'red');
      log('💡 Try: npm install -g vercel && vercel --prod', 'blue');
    }
  } else {
    log('\n👌 No problem! You can deploy manually later.', 'blue');
    log('💡 Run "npm run serve:web" to test locally first.', 'blue');
  }
  rl.close();
});
