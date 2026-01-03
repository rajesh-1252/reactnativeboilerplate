import { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * PROJECT CONFIGURATION
 * 
 * Change these values to rename your app and configure its identity.
 * This file replaces the static app.json.
 */
const PROJECT_CONFIG = {
  name: "My SaaS App",                    // The display name of your app
  slug: "my-saas-app",                    // The URL slug for Expo dashboard
  bundleIdentifier: "com.yourname.myapp", // iOS bundle ID
  packageName: "com.yourname.myapp",      // Android package name
  scheme: "my-saas-app",                  // Deep linking scheme
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: PROJECT_CONFIG.name,
  slug: PROJECT_CONFIG.slug,
  scheme: PROJECT_CONFIG.scheme,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  
  ios: {
    bundleIdentifier: PROJECT_CONFIG.bundleIdentifier,
    supportsTablet: true
  },
  
  android: {
    package: PROJECT_CONFIG.packageName,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png"
    },
    edgeToEdgeEnabled: true
  },
  
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "backgroundColor": "#000000"
        }
      }
    ]
  ],
  
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  }
});
