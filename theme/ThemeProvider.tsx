import { TamaguiProvider as TamaguiProviderCore } from '@tamagui/core';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import tamaguiConfig from './tamagui.config';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider wraps the app with Tamagui theming
 * Configured for dark mode only as per design requirements
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <TamaguiProviderCore config={tamaguiConfig} defaultTheme="dark">
      <StatusBar style="light" />
      {children}
    </TamaguiProviderCore>
  );
}

export default ThemeProvider;
