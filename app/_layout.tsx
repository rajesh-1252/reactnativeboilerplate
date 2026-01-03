import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { revenueCat } from '@/config/revenuecat';
import { initDatabase, runMigrations } from '@/db';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/themeStore';
import { initializeSync } from '@/sync';
import { ThemeProvider } from '@/theme';
import { themeColors } from '@/theme/tokens';

// Keep splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

/**
 * Root Layout with providers and initialization
 */
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const setAuthLoading = useAuthStore((s) => s.setLoading);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  
  useEffect(() => {
    async function initialize() {
      try {
        // Initialize database
        await initDatabase();
        
        // Run any pending migrations
        await runMigrations();
        
        // Initialize Sync Engine (Supabase integration)
        await initializeSync();
        
        // Configure RevenueCat (if enabled)
        await revenueCat.configure();
        
        // TODO: Check for persisted auth session
        // For now, we'll just mark loading as complete
        setAuthLoading(false);
        
        console.log('[App] Initialization complete');
      } catch (error) {
        console.error('[App] Initialization failed:', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    
    initialize();
  }, []);
  
  if (!isReady) {
    return null;
  }

  const palette = themeColors[currentTheme];
  
  return (
    <ThemeProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          headerStyle: {
            backgroundColor: palette.background,
          },
          headerTintColor: palette.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Info',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
