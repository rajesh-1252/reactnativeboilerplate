// Theme tokens for the application
// Using a neutral, professional dark theme color palette

export const tokens = {
  // Colors - Neutral dark palette
  color: {
    // Background hierarchy
    background: '#0A0A0B',
    backgroundSubtle: '#111113',
    backgroundMuted: '#18181B',
    backgroundElevated: '#1F1F23',
    
    // Surface/Card colors
    surface: '#18181B',
    surfaceHover: '#1F1F23',
    surfaceActive: '#27272A',
    
    // Border colors
    border: '#27272A',
    borderSubtle: '#1F1F23',
    borderFocus: '#52525B',
    
    // Text colors
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textDisabled: '#52525B',
    
    // Primary accent
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryActive: '#1D4ED8',
    primaryMuted: '#1E3A5F',
    
    // Secondary accent
    secondary: '#6366F1',
    secondaryHover: '#4F46E5',
    secondaryActive: '#4338CA',
    
    // Semantic colors
    success: '#22C55E',
    successMuted: '#14532D',
    warning: '#F59E0B',
    warningMuted: '#78350F',
    error: '#EF4444',
    errorMuted: '#7F1D1D',
    info: '#06B6D4',
    infoMuted: '#164E63',
    
    // Transparency
    overlay: 'rgba(0, 0, 0, 0.6)',
    transparent: 'transparent',
  },
  
  // Spacing - 4px base scale
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
  },
  
  // Border radius
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    full: 9999,
  },
  
  // Font sizes
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 30,
    popover: 40,
    tooltip: 50,
    toast: 60,
  },
} as const;

// ============================================
// THEME COLOR PALETTES
// ============================================

export type ThemeName = 'light' | 'dark' | 'premium';

export interface ThemeColorPalette {
  // Background hierarchy
  background: string;
  backgroundSubtle: string;
  backgroundMuted: string;
  backgroundElevated: string;
  
  // Surface/Card colors
  surface: string;
  surfaceHover: string;
  surfaceActive: string;
  
  // Border colors
  border: string;
  borderSubtle: string;
  borderFocus: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  
  // Primary accent
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryMuted: string;
  
  // Secondary accent
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  
  // Semantic colors
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
  info: string;
  infoMuted: string;
  
  // Transparency
  overlay: string;
  transparent: string;
  
  // StatusBar style
  statusBarStyle: 'light' | 'dark';
}

/**
 * Theme color palettes - Extensible to n themes
 * Add new themes by adding a new key to this object
 */
export const themeColors: Record<ThemeName, ThemeColorPalette> = {
  // DARK THEME - Professional dark palette
  dark: {
    background: '#0A0A0B',
    backgroundSubtle: '#111113',
    backgroundMuted: '#18181B',
    backgroundElevated: '#1F1F23',
    surface: '#18181B',
    surfaceHover: '#1F1F23',
    surfaceActive: '#27272A',
    border: '#27272A',
    borderSubtle: '#1F1F23',
    borderFocus: '#52525B',
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textDisabled: '#52525B',
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryActive: '#1D4ED8',
    primaryMuted: '#1E3A5F',
    secondary: '#6366F1',
    secondaryHover: '#4F46E5',
    secondaryActive: '#4338CA',
    success: '#22C55E',
    successMuted: '#14532D',
    warning: '#F59E0B',
    warningMuted: '#78350F',
    error: '#EF4444',
    errorMuted: '#7F1D1D',
    info: '#06B6D4',
    infoMuted: '#164E63',
    overlay: 'rgba(0, 0, 0, 0.6)',
    transparent: 'transparent',
    statusBarStyle: 'light',
  },

  // LIGHT THEME - Clean, modern light palette
  light: {
    background: '#FFFFFF',
    backgroundSubtle: '#F9FAFB',
    backgroundMuted: '#F3F4F6',
    backgroundElevated: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHover: '#F9FAFB',
    surfaceActive: '#F3F4F6',
    border: '#E5E7EB',
    borderSubtle: '#F3F4F6',
    borderFocus: '#9CA3AF',
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    textDisabled: '#D1D5DB',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primaryActive: '#1E40AF',
    primaryMuted: '#DBEAFE',
    secondary: '#4F46E5',
    secondaryHover: '#4338CA',
    secondaryActive: '#3730A3',
    success: '#16A34A',
    successMuted: '#DCFCE7',
    warning: '#D97706',
    warningMuted: '#FEF3C7',
    error: '#DC2626',
    errorMuted: '#FEE2E2',
    info: '#0891B2',
    infoMuted: '#CFFAFE',
    overlay: 'rgba(0, 0, 0, 0.4)',
    transparent: 'transparent',
    statusBarStyle: 'dark',
  },

  // PREMIUM THEME - Luxury purple/gold aesthetic
  premium: {
    background: '#0F0A1A',
    backgroundSubtle: '#1A1225',
    backgroundMuted: '#231830',
    backgroundElevated: '#2D1F3D',
    surface: '#1A1225',
    surfaceHover: '#231830',
    surfaceActive: '#2D1F3D',
    border: '#3D2952',
    borderSubtle: '#2D1F3D',
    borderFocus: '#6B4F8A',
    text: '#F8F5FF',
    textSecondary: '#C4B5D8',
    textMuted: '#8B7AA0',
    textDisabled: '#5C4D6E',
    primary: '#A855F7',
    primaryHover: '#9333EA',
    primaryActive: '#7C3AED',
    primaryMuted: '#3B1F5C',
    secondary: '#D4AF37',
    secondaryHover: '#C9A227',
    secondaryActive: '#B8941F',
    success: '#10B981',
    successMuted: '#1A3D32',
    warning: '#F59E0B',
    warningMuted: '#3D2E0F',
    error: '#F43F5E',
    errorMuted: '#3D1F2A',
    info: '#8B5CF6',
    infoMuted: '#2E1F4D',
    overlay: 'rgba(15, 10, 26, 0.7)',
    transparent: 'transparent',
    statusBarStyle: 'light',
  },
};

/**
 * Get list of available theme names
 */
export const availableThemes = Object.keys(themeColors) as ThemeName[];

// Typography configuration
export const fonts = {
  body: 'Inter',
  heading: 'Inter',
  mono: 'SpaceMono',
} as const;

export const fontSizes = {
  1: 12,
  2: 14,
  3: 16,
  4: 18,
  5: 20,
  6: 24,
  7: 30,
  8: 36,
  9: 48,
  10: 60,
} as const;

export const lineHeights = {
  1: 16,
  2: 20,
  3: 24,
  4: 28,
  5: 28,
  6: 32,
  7: 36,
  8: 40,
  9: 56,
  10: 72,
} as const;

export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type Tokens = typeof tokens;
export type ColorToken = keyof typeof tokens.color;
export type SpaceToken = keyof typeof tokens.space;
export type RadiusToken = keyof typeof tokens.radius;
