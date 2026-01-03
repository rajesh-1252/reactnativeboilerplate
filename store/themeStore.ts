import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { ThemeName, availableThemes, themeColors } from '../theme/tokens';

const THEME_STORAGE_KEY = '@app_theme';
const DEFAULT_THEME: ThemeName = 'dark';

interface ThemeState {
  // Current active theme
  currentTheme: ThemeName;
  
  // Available themes for UI selection
  availableThemes: ThemeName[];
  
  // Loading state for initial theme load
  isLoading: boolean;
  
  // Actions
  setTheme: (theme: ThemeName) => Promise<void>;
  loadThemeFromStorage: () => Promise<void>;
  
  // Helper to get status bar style
  getStatusBarStyle: () => 'light' | 'dark';
}

/**
 * Theme store for managing app theme state
 * Persists theme preference to AsyncStorage
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: DEFAULT_THEME,
  availableThemes: availableThemes,
  isLoading: true,

  setTheme: async (theme: ThemeName) => {
    // Validate theme exists
    if (!availableThemes.includes(theme)) {
      console.warn(`Theme "${theme}" not found, falling back to "${DEFAULT_THEME}"`);
      theme = DEFAULT_THEME;
    }
    
    // Update state
    set({ currentTheme: theme });
    
    // Persist to storage
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  },

  loadThemeFromStorage: async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      
      if (storedTheme && availableThemes.includes(storedTheme as ThemeName)) {
        set({ currentTheme: storedTheme as ThemeName, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      set({ isLoading: false });
    }
  },

  getStatusBarStyle: () => {
    const { currentTheme } = get();
    return themeColors[currentTheme].statusBarStyle;
  },
}));

/**
 * Hook to access theme and theme actions
 */
export function useTheme() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const availableThemes = useThemeStore((state) => state.availableThemes);
  const isLoading = useThemeStore((state) => state.isLoading);
  const getStatusBarStyle = useThemeStore((state) => state.getStatusBarStyle);

  return {
    theme: currentTheme,
    setTheme,
    availableThemes,
    isLoading,
    statusBarStyle: getStatusBarStyle(),
    
    // Convenience methods
    setLightTheme: () => setTheme('light'),
    setDarkTheme: () => setTheme('dark'),
    setPremiumTheme: () => setTheme('premium'),
    
    // Check current theme
    isLight: currentTheme === 'light',
    isDark: currentTheme === 'dark',
    isPremium: currentTheme === 'premium',
  };
}

export type { ThemeName };
