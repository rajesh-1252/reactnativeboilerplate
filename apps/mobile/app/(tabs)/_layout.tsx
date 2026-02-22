import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@tamagui/core';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

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
          borderTopColor: theme.borderColor?.get(),
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
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color={theme.color?.get()}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
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
