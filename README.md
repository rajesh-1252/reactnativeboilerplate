# Hybrid Expo Monorepo (Mobile + Backend)

A production-ready monorepo structure featuring an Expo mobile app with a Hybrid Architecture (Offline-First or Online-First) and a TypeScript backend API.

## 🏗️ Structure

- `apps/mobile`: Expo (React Native) application with SQLite and Tamagui.
- `apps/api`: Node.js/Express backend API.
- `packages/shared`: Shared TypeScript types and constants.

## 🚀 Quick Start

### 1. Install Dependencies

Run this in the root directory to install all package dependencies and link shared packages:

```bash
npm install
```

### 2. Run the Development Environment

Run both the mobile app and backend API simultaneously:

```bash
npm run dev
```

Run just the mobile app on a specific platform:

```bash
npm run android
# or
npm run ios
```

## ⚙️ Configuration

### Architecture Toggle (Offline vs Online)

You can switch the app's behavior in `apps/mobile/config/architecture.ts`:

```typescript
export const ARCHITECTURE_CONFIG = {
  mode: "offline-first", // Change to 'online-first' for remote-first behavior
  useCache: true,
};
```

## 🛠️ Monorepo Commands

- `npm run dev`: Start all apps.
- `npm run build`: Build all packages.
- `npm run lint`: Lint all packages.
- `npm run rename-project`: Rename the mobile app and its bundle identifiers.
- `npm run reset-project`: Reset the mobile app to its initial state.

For mobile-specific commands (like `npx expo run:ios`), navigate to `apps/mobile`.
