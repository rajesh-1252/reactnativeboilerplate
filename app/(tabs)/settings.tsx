import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { H3, Text } from '@/components/Text';
import { useFeatureFlag } from '@/config/features';
import { useAuthActions, useAuthStore } from '@/store/auth';
import { useSyncStatus } from '@/store/sync';
import { useTheme } from '@/theme';
import { tokens } from '@/theme/tokens';
import { useTheme as useTamaguiTheme } from '@tamagui/core';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

/**
 * Settings screen
 */
export default function SettingsScreen() {
  const router = useRouter();
  const tamaguiTheme = useTamaguiTheme();
  const { logout } = useAuthActions();
  const user = useAuthStore((s) => s.user);
  const { connectionState, lastSyncTime, pendingChangesCount } = useSyncStatus();
  const { theme, setDarkTheme, setLightTheme, setPremiumTheme } = useTheme();
  
  const isSyncEnabled = useFeatureFlag('enableSupabaseSync');
  const isRevenueCatEnabled = useFeatureFlag('enableRevenueCat');
  
  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor: tamaguiTheme.background?.get() || tamaguiTheme.color?.get(),
    },
    rowBorder: {
      borderBottomColor: tamaguiTheme.borderSubtle?.get() || tamaguiTheme.border?.get(),
    }
  }), [tamaguiTheme]);
  
  return (
    <ScrollView 
      style={[styles.container, dynamicStyles.container]} 
      contentContainerStyle={styles.content}
    >
      {/* Theme Section */}
      <Card variant="default" style={styles.section}>
        <H3 style={styles.sectionTitle}>Appearance</H3>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Current Theme</Text>
          <Text variant="body" style={styles.themeLabel}>{theme}</Text>
        </View>
        <View style={styles.themeButtons}>
          <Button 
            variant={theme === 'light' ? 'primary' : 'outline'} 
            size="sm"
            onPress={setLightTheme}
            style={styles.themeButton}
          >
            ☀️ Light
          </Button>
          <Button 
            variant={theme === 'dark' ? 'primary' : 'outline'} 
            size="sm"
            onPress={setDarkTheme}
            style={styles.themeButton}
          >
            🌙 Dark
          </Button>
          <Button 
            variant={theme === 'premium' ? 'primary' : 'outline'} 
            size="sm"
            onPress={setPremiumTheme}
            style={styles.themeButton}
          >
            💎 Premium
          </Button>
        </View>
      </Card>

      {/* User Section */}
      <Card variant="default" style={styles.section}>
        <H3 style={styles.sectionTitle}>Account</H3>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Email</Text>
          <Text variant="body">{user?.email ?? 'Not logged in'}</Text>
        </View>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Name</Text>
          <Text variant="body">{user?.name ?? 'Unknown'}</Text>
        </View>
        <Button variant="outline" onPress={handleLogout} style={styles.button}>
          Sign Out
        </Button>
      </Card>
      
      {/* Sync Section */}
      <Card variant="default" style={styles.section}>
        <H3 style={styles.sectionTitle}>Sync Status</H3>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Connection</Text>
          <Text variant="body">{connectionState}</Text>
        </View>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Last Sync</Text>
          <Text variant="body">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Never'}
          </Text>
        </View>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Pending Changes</Text>
          <Text variant="body">{pendingChangesCount}</Text>
        </View>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Sync Enabled</Text>
          <Text variant="body" color={isSyncEnabled ? 'primary' : 'muted'}>
            {isSyncEnabled ? 'Yes' : 'No (configure Supabase)'}
          </Text>
        </View>
      </Card>
      
      {/* Features Section */}
      <Card variant="default" style={styles.section}>
        <H3 style={styles.sectionTitle}>Features</H3>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">Supabase Sync</Text>
          <Text variant="body" color={isSyncEnabled ? 'primary' : 'muted'}>
            {isSyncEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        <View style={[styles.row, dynamicStyles.rowBorder]}>
          <Text variant="label" color="secondary">RevenueCat</Text>
          <Text variant="body" color={isRevenueCatEnabled ? 'primary' : 'muted'}>
            {isRevenueCatEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </Card>
      
      {/* About Section */}
      <Card variant="outlined" style={styles.section}>
        <H3 style={styles.sectionTitle}>About</H3>
        <Text variant="bodySmall" color="muted" style={styles.about}>
          Expo Offline-First Boilerplate{'\n'}
          Built with Expo, SQLite, Tamagui, Zustand{'\n\n'}
          This is a scaffold project. Customize it for your app.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: tokens.space[4],
    paddingBottom: tokens.space[8],
  },
  section: {
    marginBottom: tokens.space[4],
  },
  sectionTitle: {
    marginBottom: tokens.space[4],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.space[3],
    borderBottomWidth: 1,
  },
  button: {
    marginTop: tokens.space[4],
  },
  about: {
    textAlign: 'center',
    lineHeight: 22,
  },
  themeLabel: {
    textTransform: 'capitalize',
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: tokens.space[4],
    gap: tokens.space[2],
  },
  themeButton: {
    flex: 1,
  },
});
