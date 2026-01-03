import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { initDatabase, runMigrations } from '@/db';
import { useAuthStore } from '@/store/auth';
import { ThemeProvider } from '@/theme';

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
  
  useEffect(() => {
    async function initialize() {
      try {
        // Initialize database
        await initDatabase();
        
        // Run any pending migrations
        await runMigrations();
        
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
  
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Modal',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
