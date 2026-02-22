# RevenueCat Implementation Guide (Production Ready)

This document explains how in-app purchases are handled in the boilerplate and how to transition from the current development setup to a live production environment.

## 1. Architecture Overview

The implementation follows a **singleton service + reactive store** pattern:

- **`config/revenuecat.ts`**: The core service wrapping the `react-native-purchases` SDK. It handles initialization, fetching offerings, and processing transactions.
- **`useSubscriptionStore` (Zustand)**: A global state that tracks `isPro` status, current `offerings`, and `isLoading` states.
- **`components/Paywall.tsx`**: A theme-reactive UI component that displays plans and triggers the native purchase flow.

## 2. Setup Checklist

### A. Dashboard Configuration
1. Create a project in [RevenueCat Dashboard](https://app.revenuecat.com/).
2. Add your App Store (iOS) and Play Store (Android) apps to the project.
3. **Crucial**: Create an **Entitlement** with the ID `pro`.
4. Create **Offerings** and attach your store products to them.

### B. Environment Variables
Ensure your `.env` file contains the correct keys:
```bash
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
```

## 3. The Purchase Flow

1. **Initialization**: On app launch (`_layout.tsx`), the `revenueCat.configure()` method is called. It initializes the native SDK and fetches the latest `CustomerInfo` to determine if the user is already a Pro member.
2. **Fetching Offerings**: The Paywall component calls `getOfferings()` on mount. RevenueCat returns localized prices (e.g., $9.99 or ₹799) based on the user's store location.
3. **Triggering Purchase**: When a user taps a plan:
   - The UI sets the specific button to `loading`.
   - The native SDK opens the Apple/Google payment sheet.
   - Upon success, the `CustomerInfoUpdateListener` instantly detects the new `pro` entitlement.
   - The Zustand store updates `isPro: true`, which reactively hides the paywall across the entire app.

## 4. Troubleshooting "Stuck Loaders" or "Failing Purchases"

If you can't complete a purchase or the loader doesn't stop:

- **Expo Go Limitation**: In-app purchases **DO NOT WORK** in the standard Expo Go app. You must build a **Development Build** (`npx expo run:android` or `npx expo run:ios`).
- **Sandbox Accounts**: Ensure you are signed into the device with a **Sandbox Tester** account (App Store Connect) or **License Tester** account (Google Play Console).
- **Entitlement ID**: If you named your entitlement something other than `pro` in the dashboard, you must update the `updateProStatus` logic in `config/revenuecat.ts`.
- **Product Sync**: Ensure your products are marked as "Ready to Submit" or "Approved" in the respective store consoles.

## 5. Security Best Practices
- **Server Side**: While this boilerplate handles client-side validation, RevenueCat also provides **Webhooks**. You should link these to your Supabase Edge Functions to update a `is_premium` flag in your PostgreSQL database for true cross-platform sync.
- **Restores**: The "Restore Purchases" button is integrated by default to comply with App Store guidelines.

## 6. Pro-Only Features
To lock a feature behind the paywall, use the `useIsPro` hook:

```tsx
import { useIsPro } from '@/config/revenuecat';

function PremiumFeature() {
  const isPro = useIsPro();

  if (!isPro) return <Paywall />;
  return <FeatureContent />;
}
```
