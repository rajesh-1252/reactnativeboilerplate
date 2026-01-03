import { tokens } from '@/theme/tokens';
import { SPRING_CONFIGS } from '@/ui/animations';
import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  pressable?: boolean;
}

/**
 * Card container component with variants and optional press behavior
 */
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  pressable = false,
  style,
  ...props
}: CardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    if (pressable || onPress) {
      scale.value = withSpring(0.98, SPRING_CONFIGS.stiff);
    }
  };
  
  const handlePressOut = () => {
    if (pressable || onPress) {
      scale.value = withSpring(1, SPRING_CONFIGS.gentle);
    }
  };
  
  const variantStyles = getVariantStyles(variant);
  const paddingStyle = getPaddingStyles(padding);
  
  if (onPress || pressable) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, variantStyles, paddingStyle, animatedStyle, style]}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }
  
  return (
    <View style={[styles.base, variantStyles, paddingStyle, style]} {...props}>
      {children}
    </View>
  );
}

function getVariantStyles(variant: CardProps['variant']) {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: tokens.color.surfaceHover,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      };
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: tokens.color.border,
      };
    case 'default':
    default:
      return {
        backgroundColor: tokens.color.surface,
      };
  }
}

function getPaddingStyles(padding: CardProps['padding']) {
  switch (padding) {
    case 'none':
      return { padding: 0 };
    case 'sm':
      return { padding: tokens.space[3] };
    case 'lg':
      return { padding: tokens.space[6] };
    case 'md':
    default:
      return { padding: tokens.space[4] };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius[3],
  },
});

export default Card;
