#!/usr/bin/env node

/**
 * Quick Setup Script for New Projects
 * 
 * This script helps initialize a new project from the template
 * Run with: node setup-new-project.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function setupProject() {
  console.log('🏗️  Setting up your new app from template...\n');

  // Collect project information
  const appName = await question('App Name (e.g., "My Awesome App"): ');
  const appSlug = await question('App Slug (e.g., "my-awesome-app"): ');
  const bundleId = await question('Bundle Identifier (e.g., "com.yourcompany.myapp"): ');
  const backendUrl = await question('Backend URL (e.g., "https://myapp-backend.railway.app"): ');
  
  console.log('\n🔧 Configuring files...');

  try {
    // 1. Setup frontend configuration
    if (fs.existsSync('frontend/app.template.json')) {
      let appConfig = fs.readFileSync('frontend/app.template.json', 'utf8');
      appConfig = appConfig.replace(/YOUR_APP_NAME/g, appName);
      appConfig = appConfig.replace(/your-app-slug/g, appSlug);
      appConfig = appConfig.replace(/com\.yourcompany\.yourapp/g, bundleId);
      appConfig = appConfig.replace(/your-backend-domain\.com/g, new URL(backendUrl).hostname);
      
      fs.writeFileSync('frontend/app.json', appConfig);
      console.log('✅ Created frontend/app.json');
    }

    // 2. Setup API configuration
    if (fs.existsSync('frontend/utils/apiConfig.template.ts')) {
      let apiConfig = fs.readFileSync('frontend/utils/apiConfig.template.ts', 'utf8');
      apiConfig = apiConfig.replace(/https:\/\/your-backend-domain\.com/g, backendUrl);
      
      fs.writeFileSync('frontend/utils/apiConfig.ts', apiConfig);
      console.log('✅ Created frontend/utils/apiConfig.ts');
    }

    // 3. Copy EAS template
    if (fs.existsSync('frontend/eas.template.json')) {
      fs.copyFileSync('frontend/eas.template.json', 'frontend/eas.json');
      console.log('✅ Created frontend/eas.json (update with your Apple credentials)');
    }

    // 4. Copy backend environment template
    if (fs.existsSync('backend/env.template')) {
      fs.copyFileSync('backend/env.template', 'backend/.env');
      console.log('✅ Created backend/.env (update with your credentials)');
    }

    console.log('\n🎉 Project setup complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update backend/.env with your database and API keys');
    console.log('2. Update frontend/eas.json with your Apple developer credentials');
    console.log('3. cd backend && npm install && npm run migrate && npm run seed');
    console.log('4. cd frontend && npm install && npm start');
    console.log('\n📖 See TEMPLATE_SETUP_GUIDE.md for detailed instructions');

  } catch (error) {
    console.error('❌ Error setting up project:', error.message);
  }

  rl.close();
}

setupProject();
