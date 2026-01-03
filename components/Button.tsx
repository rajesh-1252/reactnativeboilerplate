import { tokens } from '@/theme/tokens';
import { SPRING_CONFIGS } from '@/ui/animations';
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
  
  const variantStyles = getVariantStyles(variant, disabled);
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

function getVariantStyles(variant: ButtonProps['variant'], disabled: boolean) {
  const opacity = disabled ? 0.5 : 1;
  
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: tokens.color.primary,
          opacity,
        },
        textColor: tokens.color.text,
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: tokens.color.secondary,
          opacity,
        },
        textColor: tokens.color.text,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: tokens.color.border,
          opacity,
        },
        textColor: tokens.color.text,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          opacity,
        },
        textColor: tokens.color.textSecondary,
      };
    default:
      return {
        container: { backgroundColor: tokens.color.primary },
        textColor: tokens.color.text,
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
