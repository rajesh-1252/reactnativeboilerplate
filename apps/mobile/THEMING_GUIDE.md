# Theming System Guide

This boilerplate uses a highly flexible, token-based theming system powered by **Tamagui** and **Zustand**. It supports multiple built-in themes (Light, Dark, Premium) and is designed to be easily extensible.

## 1. Core Concepts

The theme system is built on three pillars:
1.  **Tokens (`theme/tokens.ts`)**: The raw design values (colors, spacing, sizes) that remain constant or change per theme.
2.  **Tamagui Config (`theme/tamagui.config.ts`)**: Maps tokens to a structured theme object that Tamagui components understand.
3.  **Theme Store (`store/themeStore.ts`)**: Manages the active theme state, persists it to `AsyncStorage`, and handles the global status bar style.

## 2. Using Themes in Components

### Using Custom Components
All basic components in `components/` (Text, Button, Card, Input) are **theme-aware** by default. Simply use them, and they will react to theme changes automatically.

```tsx
import { Text, H1 } from '@/components/Text';
import { Card } from '@/components/Card';

export function MyComponent() {
  return (
    <Card variant="elevated">
      <H1>Theme Aware Title</H1>
      <Text color="secondary">I change colors instantly!</Text>
    </Card>
  );
}
```

### Using the `useTheme` Hook
For custom styling that isn't covered by base components, use the Tamagui `useTheme` hook to get the current palette.

```tsx
import { useTheme } from '@tamagui/core';
import { View } from 'react-native';

export function CustomBox() {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background?.get(), padding: 20 }}>
      {/* theme.primary.get(), theme.border.get(), etc. */}
    </View>
  );
}
```

## 3. How to Add a New Theme

Adding a new theme (e.g., "Midnight" or "Forest") takes just a few steps:

1.  **Update `ThemeName`**: Add your theme name to the `ThemeName` type in `theme/tokens.ts`.
2.  **Define Palette**: Add your palette to the `themeColors` object in `theme/tokens.ts`.
    ```typescript
    midnight: {
      background: '#00040D',
      text: '#E0E6ED',
      primary: '#00D4FF',
      // ... fill in other required fields
      statusBarStyle: 'light',
    }
    ```
3.  **UI Switcher**: Add a button in `app/(tabs)/settings.tsx` to trigger your new theme.
    ```tsx
    const { setTheme } = useTheme();
    // ...
    <Button onPress={() => setTheme('midnight')}>Midnight</Button>
    ```

## 4. Performance Tips
- **Avoid string interpolation**: Use `theme.color.get()` for better performance inside `useMemo` or style objects.
- **Root Layout Rendering**: The `ThemeProvider` wraps the entire app, ensuring that even navigation headers and the status bar update without a flicker.
