import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { H1, Text } from '@/components/Text';
import { useAuthActions } from '@/store/auth';
import { tokens } from '@/theme/tokens';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

/**
 * Login screen scaffold
 * Replace with your actual authentication logic
 */
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthActions();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual authentication
      // For scaffold, we'll simulate a login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      login(
        { id: '1', email, name: 'Demo User' },
        { accessToken: 'demo-token', expiresAt: Date.now() + 86400000 }
      );
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSkip = () => {
    // Allow skipping auth for demo purposes
    login(
      { id: 'guest', email: 'guest@example.com', name: 'Guest' },
      { accessToken: 'guest-token', expiresAt: Date.now() + 86400000 }
    );
    router.replace('/(tabs)');
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <H1 style={styles.title}>Welcome</H1>
          <Text color="secondary" style={styles.subtitle}>
            Sign in to continue
          </Text>
        </View>
        
        <Card variant="default" padding="lg" style={styles.card}>
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {error && (
            <Text color="error" style={styles.error}>
              {error}
            </Text>
          )}
          
          <Button
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          >
            Sign In
          </Button>
          
          <Button
            variant="ghost"
            onPress={handleSkip}
            fullWidth
          >
            Continue as Guest
          </Button>
        </Card>
        
        <Text color="muted" style={styles.footer}>
          This is a scaffold login screen.{'\n'}
          Replace with your authentication implementation.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: tokens.space[6],
  },
  header: {
    marginBottom: tokens.space[8],
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: tokens.space[2],
  },
  card: {
    marginBottom: tokens.space[6],
  },
  error: {
    marginBottom: tokens.space[4],
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    fontSize: tokens.size.xs,
  },
});
