/**
 * Feature Flags Configuration
 * 
 * Use feature flags to enable/disable optional features.
 * This allows the boilerplate to be customized without code changes.
 */

export interface FeatureFlags {
  /** Enable Supabase sync backend */
  enableSupabaseSync: boolean;
  
  /** Enable RevenueCat for in-app purchases */
  enableRevenueCat: boolean;
  
  /** Enable push notifications */
  enablePushNotifications: boolean;
  
  /** Enable analytics tracking */
  enableAnalytics: boolean;
  
  /** Enable crash reporting */
  enableCrashReporting: boolean;
  
  /** Enable offline mode banner */
  showOfflineBanner: boolean;
  
  /** Enable debug mode features */
  debugMode: boolean;
}

/**
 * Default feature flags
 * Override these using environment variables or runtime configuration
 */
export const defaultFeatureFlags: FeatureFlags = {
  // Backend integrations - disabled by default
  enableSupabaseSync: !!process.env.EXPO_PUBLIC_SUPABASE_URL,
  enableRevenueCat: !!process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
  enablePushNotifications: false,
  
  // Monitoring - disabled by default
  enableAnalytics: false,
  enableCrashReporting: false,
  
  // UI features
  showOfflineBanner: true,
  
  // Development
  debugMode: __DEV__,
};

// Current feature flags state
let currentFlags: FeatureFlags = { ...defaultFeatureFlags };

/**
 * Get current feature flags
 */
export function getFeatureFlags(): FeatureFlags {
  return { ...currentFlags };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return currentFlags[feature];
}

/**
 * Update feature flags at runtime
 * Useful for A/B testing or gradual rollouts
 */
export function setFeatureFlags(flags: Partial<FeatureFlags>): void {
  currentFlags = { ...currentFlags, ...flags };
}

/**
 * Reset to default feature flags
 */
export function resetFeatureFlags(): void {
  currentFlags = { ...defaultFeatureFlags };
}

/**
 * Hook-friendly feature flag checker
 * Usage: const isEnabled = useFeatureFlag('enableSupabaseSync');
 */
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  // In a real app, you might want to use useSyncExternalStore
  // for reactive updates to feature flags
  return currentFlags[feature];
}
