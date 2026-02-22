import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesOffering } from 'react-native-purchases';
import { create } from 'zustand';
import { isFeatureEnabled } from './features';

/**
 * RevenueCat Integration - Production Ready
 */

interface RevenueCatState {
  isPro: boolean;
  offerings: PurchasesOffering | null;
  isLoading: boolean;
  error: string | null;
  setPro: (isPro: boolean) => void;
  setOfferings: (offerings: PurchasesOffering | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Zustand store for subscription state
 */
export const useSubscriptionStore = create<RevenueCatState>((set) => ({
  isPro: false,
  offerings: null,
  isLoading: false,
  error: null,
  setPro: (isPro) => set({ isPro }),
  setOfferings: (offerings) => set({ offerings }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

class RevenueCatService {
  isConfigured = false;
  
  async configure(): Promise<void> {
    if (!isFeatureEnabled('enableRevenueCat')) return;
    if (this.isConfigured) return;
    
    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
      android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
    }) || process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
    
    if (!apiKey) {
      console.warn('[RevenueCat] API key not found. Check your .env file.');
      return;
    }
    
    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }
      
      Purchases.configure({ apiKey });
      this.isConfigured = true;
      
      // Listen for changes in customer info (e.g. renewals, expirations)
      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        this.updateProStatus(customerInfo);
      });

      // Initial check
      const customerInfo = await Purchases.getCustomerInfo();
      this.updateProStatus(customerInfo);
      
      console.log('[RevenueCat] Configured successfully');
    } catch (e) {
      console.error('[RevenueCat] Configuration failed:', e);
    }
  }

  private updateProStatus(customerInfo: any) {
    // 'pro' MUST match the Entitlement ID in your RevenueCat Dashboard
    const isPro = customerInfo.entitlements.active['pro'] !== undefined;
    useSubscriptionStore.getState().setPro(isPro);
  }
  
  async getOfferings() {
    if (!this.isConfigured) await this.configure();
    if (!this.isConfigured) return null;
    
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        useSubscriptionStore.getState().setOfferings(offerings.current);
        return offerings.current;
      }
    } catch (e) {
      console.error('[RevenueCat] Failed to fetch offerings:', e);
    }
    return null;
  }
  
  async purchase(pkg: any): Promise<boolean> {
    if (!this.isConfigured) return false;
    
    const store = useSubscriptionStore.getState();
    store.setLoading(true);
    store.setError(null);
    
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isPro = customerInfo.entitlements.active['pro'] !== undefined;
      store.setPro(isPro);
      return isPro;
    } catch (e: any) {
      if (e.userCancelled) {
        console.log('[RevenueCat] User cancelled purchase');
      } else {
        console.error('[RevenueCat] Purchase failed:', e);
        store.setError(e.message || 'Purchase failed');
      }
      return false;
    } finally {
      store.setLoading(false);
    }
  }
  
  async restore(): Promise<boolean> {
    if (!this.isConfigured) return false;
    
    const store = useSubscriptionStore.getState();
    store.setLoading(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPro = customerInfo.entitlements.active['pro'] !== undefined;
      store.setPro(isPro);
      return isPro;
    } catch (e: any) {
      console.error('[RevenueCat] Restore failed:', e);
      store.setError(e.message || 'Restore failed');
      return false;
    } finally {
      store.setLoading(false);
    }
  }
}

export const revenueCat = new RevenueCatService();

export function useIsPro() {
  return useSubscriptionStore((s) => s.isPro);
}

export default revenueCat;
