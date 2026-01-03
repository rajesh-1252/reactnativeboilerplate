import { revenueCat, useSubscriptionStore } from '@/config/revenuecat';
import { tokens } from '@/theme/tokens';
import { useTheme } from '@tamagui/core';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { Card } from './Card';
import { H3, Text } from './Text';

/**
 * Paywall component to show offerings and handle purchases
 */
export function Paywall() {
  const theme = useTheme();
  const { offerings, isPro, isLoading, error } = useSubscriptionStore();
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  
  useEffect(() => {
    revenueCat.getOfferings();
  }, []);

  const handlePurchase = async (pkg: any) => {
    setActivePackageId(pkg.identifier);
    await revenueCat.purchase(pkg);
    setActivePackageId(null);
  };

  if (isPro) {
    return (
      <Card variant="default" padding="lg" style={styles.proCard}>
        <H3 color="primary" style={styles.centerText}>✨ You are a Pro Member</H3>
        <Text color="secondary" style={styles.centerText}>
          Thank you for supporting our app! You have access to all premium features.
        </Text>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg" style={styles.card}>
      <H3 style={styles.title}>Unlock Premium</H3>
      <Text color="secondary" style={styles.description}>
        Get access to cloud sync, custom themes, and unlimited items.
      </Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text variant="caption" color="error">{error}</Text>
        </View>
      )}

      {offerings ? (
        <View style={styles.packages}>
          {offerings.availablePackages.map((pkg) => {
            const isThisLoading = isLoading && activePackageId === pkg.identifier;
            
            return (
              <Card key={pkg.identifier} variant="outlined" padding="md" style={styles.packageCard}>
                <View style={styles.packageHeader}>
                  <Text variant="label">{pkg.product.title}</Text>
                  <Text variant="label" color="primary">{pkg.product.priceString}</Text>
                </View>
                <Text variant="caption" color="muted" style={styles.packageDesc}>
                  {pkg.product.description}
                </Text>
                <Button 
                  size="sm" 
                  onPress={() => handlePurchase(pkg)}
                  loading={isThisLoading}
                  disabled={isLoading && !isThisLoading}
                  style={styles.purchaseButton}
                >
                  Choose {pkg.product.title}
                </Button>
              </Card>
            );
          })}
        </View>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.primary?.get()} />
          <Text variant="caption" color="muted">Loading plans from store...</Text>
        </View>
      )}

      <Button 
        variant="ghost" 
        size="sm" 
        onPress={() => revenueCat.restore()}
        disabled={isLoading}
      >
        Restore Purchases
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: tokens.space[4],
  },
  proCard: {
    marginVertical: tokens.space[4],
    borderColor: tokens.color.primary,
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: tokens.space[2],
  },
  description: {
    textAlign: 'center',
    marginBottom: tokens.space[6],
  },
  centerText: {
    textAlign: 'center',
    marginBottom: tokens.space[2],
  },
  packages: {
    gap: tokens.space[3],
    marginBottom: tokens.space[4],
  },
  packageCard: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.space[1],
  },
  packageDesc: {
    marginBottom: tokens.space[4],
  },
  purchaseButton: {
    marginTop: tokens.space[2],
  },
  loading: {
    padding: tokens.space[8],
    alignItems: 'center',
    gap: tokens.space[4],
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: tokens.space[3],
    borderRadius: tokens.radius[2],
    marginBottom: tokens.space[4],
    alignItems: 'center',
  },
});
