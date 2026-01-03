import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { H1, Text } from '@/components/Text';
import { tokens } from '@/theme/tokens';
import { useTheme as useTamaguiTheme } from '@tamagui/core';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ModalScreen() {
  const tamaguiTheme = useTamaguiTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: tamaguiTheme.backgroundMuted?.get() || tamaguiTheme.background?.get() }]}>
      <Card variant="elevated" padding="lg" style={styles.card}>
        <H1 style={styles.title}>Detailed Info</H1>
        <Text color="secondary" style={styles.text}>
          This is a theme-aware modal. It automatically adjusts its colors, shadows, and contrast to look great in Light, Dark, or Premium mode.
        </Text>
        
        <Link href="/" dismissTo style={styles.link} asChild>
          <Button variant="outline" size="md">Dismiss</Button>
        </Link>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.space[6],
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    marginBottom: tokens.space[4],
  },
  text: {
    textAlign: 'center',
    marginBottom: tokens.space[8],
  },
  link: {
    marginTop: tokens.space[4],
  },
});
