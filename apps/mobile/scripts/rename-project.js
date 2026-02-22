#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const configPath = path.join(process.cwd(), 'app.config.ts');
const packageJsonPath = path.join(process.cwd(), 'package.json');

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const updateAppConfig = (content, newName, newSlug, newBundleId, newScheme) => {
  let newContent = content;
  
  // Update name in PROJECT_CONFIG
  // Using Regex to find the key in the PROJECT_CONFIG object specifically or just the first occurrence
  // The structure is name: "Value", so we match that pattern.
  
  newContent = newContent.replace(/name:\s*["'].*?["']/, `name: "${newName}"`);
  newContent = newContent.replace(/slug:\s*["'].*?["']/, `slug: "${newSlug}"`);
  newContent = newContent.replace(/bundleIdentifier:\s*["'].*?["']/, `bundleIdentifier: "${newBundleId}"`);
  newContent = newContent.replace(/packageName:\s*["'].*?["']/, `packageName: "${newBundleId}"`);
  newContent = newContent.replace(/scheme:\s*["'].*?["']/, `scheme: "${newScheme}"`);

  return newContent;
};

const main = async () => {
  try {
    console.log("\n🚀 Verification Boilerplate Renamer");
    console.log("===================================\n");
    console.log("This script will customize the app details for you.\n");

    const newName = await question("What is the name of your app? (e.g. 'My SaaS App'): ");
    if (!newName.trim()) {
      console.log("❌ App name is required.");
      rl.close();
      return;
    }

    const defaultSlug = newName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const newSlug = await question(`What is the slug? (default: '${defaultSlug}'): `) || defaultSlug;

    const defaultBundleId = `com.app.${newSlug.replace(/-/g, '')}`;
    const newBundleId = await question(`What is the bundle identifier? (default: '${defaultBundleId}'): `) || defaultBundleId;

    const defaultScheme = newSlug;
    const newScheme = await question(`What is the deep link scheme? (default: '${defaultScheme}'): `) || defaultScheme;

    console.log("\n⚙️  Updating configuration files...");

    // Update app.config.ts
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const updatedConfig = updateAppConfig(configContent, newName, newSlug, newBundleId, newScheme);
      fs.writeFileSync(configPath, updatedConfig);
      console.log("✅ app.config.ts updated");
    } else {
      console.log("⚠️  app.config.ts not found");
    }

    // Update app.json
    const appJsonPath = path.join(process.cwd(), 'app.json');
    if (fs.existsSync(appJsonPath)) {
      try {
        const appJsonContent = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        if (appJsonContent.expo) {
          appJsonContent.expo.name = newName;
          appJsonContent.expo.slug = newSlug;
          appJsonContent.expo.scheme = newScheme;
          appJsonContent.expo.ios = { ...appJsonContent.expo.ios, bundleIdentifier: newBundleId };
          appJsonContent.expo.android = { ...appJsonContent.expo.android, package: newBundleId };
          
          fs.writeFileSync(appJsonPath, JSON.stringify(appJsonContent, null, 2) + '\n');
          console.log("✅ app.json updated");
        }
      } catch (e) {
        console.log("⚠️  Could not parse or update app.json: " + e.message);
      }
    }

    // Update package.json
    if (fs.existsSync(packageJsonPath)) {
      const packageContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageContent.name = newSlug;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageContent, null, 2) + '\n'); // Add newline at EOF
      console.log("✅ package.json updated");
    } else {
      console.log("⚠️  package.json not found");
    }

    console.log("\n✨ Project renamed successfully!");
    console.log(`\nNew Config:\n- Name: ${newName}\n- Slug: ${newSlug}\n- Bundle ID: ${newBundleId}\n- Scheme: ${newScheme}\n`);
    
  } catch (error) {
    console.error("❌ An error occurred:", error);
  } finally {
    rl.close();
  }
};

main();
