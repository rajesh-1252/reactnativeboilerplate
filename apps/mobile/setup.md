# Project Setup Guide

This guide will help you set up the project locally and customize it for your needs.

## 1. Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo Go app on your physical device (optional)
- Android Studio / Xcode (for local simulation)

## 2. Installation

First, clone the repository and install the dependencies:

```bash
npm install
```

## 3. Rename the App

This boilerplate comes with a built-in script to automatically rename the project, update bundle identifiers, and configure deep linking schemes. 

Run the following command to start the interactive setup wizard:

```bash
npm run rename-project
```

You will be asked for:
- **App Name**: The display name of your app (e.g., "My Awesome Startup")
- **Slug**: URL-friendly name for Expo (e.g., "my-awesome-startup")
- **Bundle Identifier**: Unique ID for app stores (e.g., "com.startup.app")
- **Scheme**: Deep linking scheme (e.g., "my-startup")

The script will automatically update:
- `app.config.ts`
- `package.json`
- `app.json`

## 4. Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Open `.env` and configure your API keys (Supabase, RevenueCat, etc.) if you plan to use those features.

## 5. Running the App

Start the development server:

```bash
# Start Metro Bundler
npm run start

# Run on Android Emulator
npm run android

# Run on iOS Simulator (Mac only)
npm run ios
```
