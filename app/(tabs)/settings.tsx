import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { H3, Text } from '@/components/Text';
import { useFeatureFlag } from '@/config/features';
import { useAuthActions, useAuthStore } from '@/store/auth';
import { useSyncStatus } from '@/store/sync';
import { tokens } from '@/theme/tokens';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

/**
 * Settings screen
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthActions();
  const user = useAuthStore((s) => s.user);
  const { connectionState, lastSyncTime, pendingChangesCount } = useSyncStatus();
  
  const isSyncEnabled = useFeatureFlag('enableSupabaseSync');
  const isRevenueCatEnabled = useFeatureFlag('enableRevenueCat');
  
  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Section */}
      <Card variant="default" style={styles.section}>
        <H3 style={styles.sectionTitle}>Account</H3>
        <View style={styles.row}>
          <Text variant="label" color="secondary">Email</Text>
          <Text variant="body">{user?.email ?? 'Not logged in'}</Text>
        </View>
        <View style={styles.row}>
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
        <View style={styles.row}>
          <Text variant="label" color="secondary">Connection</Text>
          <Text variant="body">{connectionState}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="label" color="secondary">Last Sync</Text>
          <Text variant="body">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Never'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="label" color="secondary">Pending Changes</Text>
          <Text variant="body">{pendingChangesCount}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="label" color="secondary">Sync Enabled</Text>
          <Text variant="body" color={isSyncEnabled ? 'primary' : 'muted'}>
            {isSyncEnabled ? 'Yes' : 'No (configure Supabase)'}
          </Text>
        </View>
      </Card>
      
      {/* Features Section */}
      <Card variant="default" style={styles.section}>
        <H3 style={styles.sectionTitle}>Features</H3>
        <View style={styles.row}>
          <Text variant="label" color="secondary">Supabase Sync</Text>
          <Text variant="body" color={isSyncEnabled ? 'primary' : 'muted'}>
            {isSyncEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        <View style={styles.row}>
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
    backgroundColor: tokens.color.background,
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
    borderBottomColor: tokens.color.borderSubtle,
  },
  button: {
    marginTop: tokens.space[4],
  },
  about: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
