import { createTamagui, createTokens } from '@tamagui/core';
import { tokens as customTokens, fontSizes, lineHeights, themeColors, ThemeName } from './tokens';

// Create Tamagui tokens from our custom tokens
const tokens = createTokens({
  color: customTokens.color,
  space: customTokens.space,
  size: customTokens.size,
  radius: customTokens.radius,
  zIndex: customTokens.zIndex,
});

/**
 * Create a theme object from a color palette
 */
function createThemeFromPalette(palette: typeof themeColors.dark) {
  return {
    background: palette.background,
    backgroundHover: palette.backgroundSubtle,
    backgroundPress: palette.backgroundMuted,
    backgroundFocus: palette.backgroundSubtle,
    backgroundStrong: palette.backgroundElevated,
    backgroundTransparent: palette.transparent,
    
    color: palette.text,
    colorHover: palette.text,
    colorPress: palette.textSecondary,
    colorFocus: palette.text,
    colorTransparent: palette.transparent,
    
    borderColor: palette.border,
    borderColorHover: palette.borderFocus,
    borderColorPress: palette.borderFocus,
    borderColorFocus: palette.primary,
    
    placeholderColor: palette.textMuted,
    
    // Semantic colors
    blue: palette.primary,
    green: palette.success,
    red: palette.error,
    yellow: palette.warning,
    
    // Surface colors for cards/containers
    surface: palette.surface,
    surfaceHover: palette.surfaceHover,
    surfaceActive: palette.surfaceActive,
    
    // Primary button colors
    primary: palette.primary,
    primaryHover: palette.primaryHover,
    primaryActive: palette.primaryActive,
    
    // Secondary accent
    secondary: palette.secondary,
    secondaryHover: palette.secondaryHover,
    secondaryActive: palette.secondaryActive,
    
    // Text hierarchy
    textPrimary: palette.text,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    textDisabled: palette.textDisabled,
    
    // Semantic
    success: palette.success,
    successMuted: palette.successMuted,
    warning: palette.warning,
    warningMuted: palette.warningMuted,
    error: palette.error,
    errorMuted: palette.errorMuted,
    info: palette.info,
    infoMuted: palette.infoMuted,
    
    // Overlay
    overlay: palette.overlay,
  };
}

// Generate themes from palettes
const themes = Object.entries(themeColors).reduce((acc, [name, palette]) => {
  acc[name as ThemeName] = createThemeFromPalette(palette);
  return acc;
}, {} as Record<ThemeName, ReturnType<typeof createThemeFromPalette>>);

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
  themes,
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
