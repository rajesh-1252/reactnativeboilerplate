import { tokens } from '@/theme/tokens';
import { useTheme } from '@tamagui/core';
import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: 'default' | 'secondary' | 'muted' | 'error' | 'primary';
}

/**
 * Typography component with predefined variants
 */
export function Text({
  variant = 'body',
  color = 'default',
  style,
  children,
  ...props
}: TextProps) {
  const theme = useTheme();
  const variantStyle = variantStyles[variant];
  
  // Dynamic color resolution from Tamagui theme
  const colorStyle = {
    color: getColorValue(color, theme),
  };
  
  return (
    <RNText style={[variantStyle, colorStyle, style]} {...props}>
      {children}
    </RNText>
  );
}

function getColorValue(color: TextProps['color'], theme: any) {
  switch (color) {
    case 'secondary':
      return theme.textSecondary?.get() || theme.colorSecondary?.get();
    case 'muted':
      return theme.textMuted?.get() || theme.colorMuted?.get();
    case 'error':
      return theme.error?.get();
    case 'primary':
      return theme.primary?.get() || theme.blue?.get();
    case 'default':
    default:
      return theme.color?.get() || theme.text?.get();
  }
}

// Heading components for convenience
export function H1(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h1" {...props} />;
}

export function H2(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h2" {...props} />;
}

export function H3(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h3" {...props} />;
}

export function H4(props: Omit<TextProps, 'variant'>) {
  return <Text variant="h4" {...props} />;
}

export function Body(props: Omit<TextProps, 'variant'>) {
  return <Text variant="body" {...props} />;
}

export function Caption(props: Omit<TextProps, 'variant'>) {
  return <Text variant="caption" {...props} />;
}

export function Label(props: Omit<TextProps, 'variant'>) {
  return <Text variant="label" {...props} />;
}

const variantStyles = StyleSheet.create({
  h1: {
    fontSize: tokens.size['4xl'],
    fontWeight: '700',
    lineHeight: tokens.size['4xl'] * 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: tokens.size['3xl'],
    fontWeight: '700',
    lineHeight: tokens.size['3xl'] * 1.2,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: tokens.size['2xl'],
    fontWeight: '600',
    lineHeight: tokens.size['2xl'] * 1.3,
  },
  h4: {
    fontSize: tokens.size.xl,
    fontWeight: '600',
    lineHeight: tokens.size.xl * 1.3,
  },
  body: {
    fontSize: tokens.size.md,
    fontWeight: '400',
    lineHeight: tokens.size.md * 1.5,
  },
  bodySmall: {
    fontSize: tokens.size.sm,
    fontWeight: '400',
    lineHeight: tokens.size.sm * 1.5,
  },
  caption: {
    fontSize: tokens.size.xs,
    fontWeight: '400',
    lineHeight: tokens.size.xs * 1.4,
  },
  label: {
    fontSize: tokens.size.sm,
    fontWeight: '500',
    lineHeight: tokens.size.sm * 1.4,
    letterSpacing: 0.2,
  },
});

export default Text;
