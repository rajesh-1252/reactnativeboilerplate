import { tokens } from '@/theme/tokens';
import { Stack } from 'expo-router';

/**
 * Auth group layout
 * Screens in this group are for unauthenticated users
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: tokens.color.background,
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
