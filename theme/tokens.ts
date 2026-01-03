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
