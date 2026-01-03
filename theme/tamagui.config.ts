import { createTamagui, createTokens } from '@tamagui/core';
import { tokens as customTokens, fontSizes, lineHeights } from './tokens';

// Create Tamagui tokens from our custom tokens
const tokens = createTokens({
  color: customTokens.color,
  space: customTokens.space,
  size: customTokens.size,
  radius: customTokens.radius,
  zIndex: customTokens.zIndex,
});

// Dark theme configuration
const darkTheme = {
  background: tokens.color.background,
  backgroundHover: tokens.color.backgroundSubtle,
  backgroundPress: tokens.color.backgroundMuted,
  backgroundFocus: tokens.color.backgroundSubtle,
  backgroundStrong: tokens.color.backgroundElevated,
  backgroundTransparent: tokens.color.transparent,
  
  color: tokens.color.text,
  colorHover: tokens.color.text,
  colorPress: tokens.color.textSecondary,
  colorFocus: tokens.color.text,
  colorTransparent: tokens.color.transparent,
  
  borderColor: tokens.color.border,
  borderColorHover: tokens.color.borderFocus,
  borderColorPress: tokens.color.borderFocus,
  borderColorFocus: tokens.color.primary,
  
  placeholderColor: tokens.color.textMuted,
  
  // Semantic colors
  blue: tokens.color.primary,
  green: tokens.color.success,
  red: tokens.color.error,
  yellow: tokens.color.warning,
  
  // Surface colors for cards/containers
  surface: tokens.color.surface,
  surfaceHover: tokens.color.surfaceHover,
  surfaceActive: tokens.color.surfaceActive,
  
  // Primary button colors
  primary: tokens.color.primary,
  primaryHover: tokens.color.primaryHover,
  primaryActive: tokens.color.primaryActive,
};

// Font configuration
const fonts = {
  body: {
    family: 'Inter',
    size: fontSizes,
    lineHeight: lineHeights,
    weight: {
      normal: '400',
      medium: '500',
      bold: '700',
    },
    letterSpacing: {
      1: 0,
      2: 0,
      3: 0,
    },
  },
  heading: {
    family: 'Inter',
    size: fontSizes,
    lineHeight: lineHeights,
    weight: {
      normal: '600',
      medium: '600',
      bold: '700',
    },
    letterSpacing: {
      1: -0.5,
      2: -0.5,
      3: -0.5,
    },
  },
};

// Create the Tamagui configuration
export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    dark: darkTheme,
    // We only use dark theme as per requirements
    // Light theme is the same for consistency
    light: darkTheme,
  },
  fonts,
  // Shorthands for common properties
  shorthands: {
    p: 'padding',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    m: 'margin',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    bg: 'backgroundColor',
    br: 'borderRadius',
    bw: 'borderWidth',
    bc: 'borderColor',
    w: 'width',
    h: 'height',
    f: 'flex',
    ai: 'alignItems',
    jc: 'justifyContent',
    fw: 'flexWrap',
    fd: 'flexDirection',
    fg: 'flexGrow',
    fs: 'flexShrink',
    fb: 'flexBasis',
  } as const,
  // Media queries for responsive design
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
  },
});

// Export types for TypeScript
export type AppConfig = typeof tamaguiConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
