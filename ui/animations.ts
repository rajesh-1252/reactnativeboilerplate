import {
    Easing,
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
    withDelay,
    withSpring,
    WithSpringConfig,
    withTiming,
    WithTimingConfig,
} from 'react-native-reanimated';

/**
 * Animation Presets for React Native Reanimated
 * Use these presets for consistent, professional animations throughout the app
 */

// Timing configurations
export const TIMING_CONFIGS = {
  fast: { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  normal: { duration: 250, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  slow: { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  entrance: { duration: 300, easing: Easing.bezier(0, 0, 0.2, 1) },
  exit: { duration: 200, easing: Easing.bezier(0.4, 0, 1, 1) },
} as const satisfies Record<string, WithTimingConfig>;

// Spring configurations
export const SPRING_CONFIGS = {
  gentle: { damping: 20, stiffness: 100, mass: 1 },
  bouncy: { damping: 10, stiffness: 180, mass: 1 },
  stiff: { damping: 25, stiffness: 300, mass: 1 },
  default: { damping: 15, stiffness: 150, mass: 1 },
} as const satisfies Record<string, WithSpringConfig>;

/**
 * Create fade in animation value
 */
export function fadeIn(
  progress: SharedValue<number>,
  config: keyof typeof TIMING_CONFIGS = 'normal'
) {
  return withTiming(1, TIMING_CONFIGS[config]);
}

/**
 * Create fade out animation value
 */
export function fadeOut(
  progress: SharedValue<number>,
  config: keyof typeof TIMING_CONFIGS = 'fast'
) {
  return withTiming(0, TIMING_CONFIGS[config]);
}

/**
 * Create slide up animation with fade
 */
export function slideUpWithFade(
  translateY: SharedValue<number>,
  opacity: SharedValue<number>,
  delay = 0
) {
  return () => {
    translateY.value = 20;
    opacity.value = 0;
    
    translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIGS.gentle));
    opacity.value = withDelay(delay, withTiming(1, TIMING_CONFIGS.entrance));
  };
}

/**
 * Create scale animation
 */
export function scaleAnimation(
  scale: SharedValue<number>,
  to: number,
  config: keyof typeof SPRING_CONFIGS = 'default'
) {
  return withSpring(to, SPRING_CONFIGS[config]);
}

/**
 * Hook: Fade in on mount
 */
export function useFadeInStyle(progress: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    opacity: progress.value,
  }));
}

/**
 * Hook: Slide up with fade animation style
 */
export function useSlideUpFadeStyle(
  translateY: SharedValue<number>,
  opacity: SharedValue<number>
) {
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

/**
 * Hook: Scale on press animation style
 */
export function usePressScaleStyle(
  scale: SharedValue<number>,
  pressedOpacity = 0.9
) {
  return useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0.95, 1], [pressedOpacity, 1]),
    transform: [{ scale: scale.value }],
  }));
}

/**
 * Hook: Stagger animation for list items
 */
export function useStaggerStyle(
  index: number,
  progress: SharedValue<number>,
  staggerDelay = 50
) {
  const delay = index * staggerDelay;
  
  return useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [20, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));
}

/**
 * Hook: Rotation animation style
 */
export function useRotateStyle(rotation: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
}

/**
 * Common animation durations in milliseconds
 */
export const DURATIONS = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
} as const;

/**
 * Common easing curves
 */
export const EASINGS = {
  linear: Easing.linear,
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
} as const;
