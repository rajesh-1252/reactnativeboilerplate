import { TamaguiProvider as TamaguiProviderCore, Theme } from '@tamagui/core';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import tamaguiConfig from './tamagui.config';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider wraps the app with Tamagui theming
 * Supports dynamic theme switching between light, dark, and premium themes
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentTheme, isLoading, loadThemeFromStorage } = useThemeStore();
  const statusBarStyle = useThemeStore((state) => state.getStatusBarStyle());

  // Load saved theme on mount
  useEffect(() => {
    loadThemeFromStorage();
  }, [loadThemeFromStorage]);

  // Show nothing while loading theme to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <TamaguiProviderCore config={tamaguiConfig} defaultTheme={currentTheme}>
      <Theme name={currentTheme}>
        <StatusBar style={statusBarStyle} />
        {children}
      </Theme>
    </TamaguiProviderCore>
  );
}

export default ThemeProvider;
