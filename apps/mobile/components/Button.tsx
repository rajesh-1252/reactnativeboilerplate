import { tokens } from '@/theme/tokens';
import { SPRING_CONFIGS } from '@/ui/animations';
import { useTheme as useTamaguiTheme } from '@tamagui/core';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text } from './Text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: object;
}

/**
 * Styled Button component with press animation
 * Updated to correctly resolve theme colors using Tamagui theme keys
 */
export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const tamaguiTheme = useTamaguiTheme();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97, SPRING_CONFIGS.stiff);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIGS.gentle);
  };
  
  const variantStyles = getVariantStyles(variant, disabled, tamaguiTheme);
  const sizeStyles = getSizeStyles(size);
  
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        style,
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
        />
      ) : (
        <Text
          variant="body"
          numberOfLines={1}
          style={[
            styles.text,
            { color: variantStyles.textColor },
            sizeStyles.text,
          ]}
        >
          {children}
        </Text>
      )}
    </AnimatedPressable>
  );
}

function getVariantStyles(variant: ButtonProps['variant'], disabled: boolean, theme: any) {
  const opacity = disabled ? 0.5 : 1;
  
  // Resolve colors based on tamagui.config.ts keys
  const primaryColor = theme.primary?.get();
  const secondaryColor = theme.secondary?.get();
  const textColor = theme.color?.get(); // This is palette.text
  const textSecondaryColor = theme.textSecondary?.get();
  const borderColorValue = theme.borderColor?.get() || theme.border?.get();
  
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: primaryColor,
          opacity,
        },
        textColor: '#FFFFFF', // High contrast on primary background
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: secondaryColor,
          opacity,
        },
        textColor: '#FFFFFF',
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: borderColorValue || textColor,
          opacity,
        },
        textColor: textColor,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          opacity,
        },
        textColor: textSecondaryColor || textColor,
      };
    default:
      return {
        container: { backgroundColor: primaryColor },
        textColor: '#FFFFFF',
      };
  }
}

function getSizeStyles(size: ButtonProps['size']) {
  switch (size) {
    case 'sm':
      return {
        container: {
          paddingVertical: tokens.space[2],
          paddingHorizontal: tokens.space[4],
        },
        text: { fontSize: tokens.size.sm },
      };
    case 'lg':
      return {
        container: {
          paddingVertical: tokens.space[4],
          paddingHorizontal: tokens.space[8],
        },
        text: { fontSize: tokens.size.lg },
      };
    case 'md':
    default:
      return {
        container: {
          paddingVertical: tokens.space[3],
          paddingHorizontal: tokens.space[6],
        },
        text: { fontSize: tokens.size.md },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius[2],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
