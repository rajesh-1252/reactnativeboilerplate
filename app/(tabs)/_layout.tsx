import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@tamagui/core';
import { Tabs } from 'expo-router';
import React from 'react';

/**
 * Tabs layout for main app navigation
 */
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.background?.get(),
        },
        headerTintColor: theme.color?.get(),
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: theme.background?.get(),
          borderTopColor: theme.border?.get(),
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.primary?.get() || theme.blue?.get(),
        tabBarInactiveTintColor: theme.textMuted?.get(),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
