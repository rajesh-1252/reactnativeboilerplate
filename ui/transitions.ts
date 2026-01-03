import { Easing } from 'react-native-reanimated';
import { TIMING_CONFIGS } from './animations';

/**
 * Screen Transition Configurations
 * Use these for consistent navigation transitions throughout the app
 */

/**
 * Fade transition for tab screens
 */
export const FadeTransition = {
  gestureEnabled: false,
  animation: 'fade' as const,
  animationDuration: TIMING_CONFIGS.normal.duration,
};

/**
 * Slide from right transition for stack screens
 */
export const SlideFromRightTransition = {
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  animation: 'slide_from_right' as const,
};

/**
 * Modal slide up transition
 */
export const ModalSlideUpTransition = {
  gestureEnabled: true,
  gestureDirection: 'vertical' as const,
  animation: 'slide_from_bottom' as const,
  presentation: 'modal' as const,
};

/**
 * Custom transition specs for programmatic use
 */
export const TransitionSpecs = {
  fadeIn: {
    animation: 'timing',
    config: {
      duration: TIMING_CONFIGS.entrance.duration,
      easing: TIMING_CONFIGS.entrance.easing,
    },
  },
  fadeOut: {
    animation: 'timing',
    config: {
      duration: TIMING_CONFIGS.exit.duration,
      easing: TIMING_CONFIGS.exit.easing,
    },
  },
  slideIn: {
    animation: 'spring',
    config: {
      damping: 20,
      stiffness: 200,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  },
} as const;

/**
 * Layout animation presets for entering/exiting views
 */
export const LayoutAnimations = {
  /**
   * Fade in when appearing
   */
  fadeIn: () => {
    'worklet';
    const timingConfig = {
      duration: TIMING_CONFIGS.entrance.duration,
    };
    return {
      initialValues: {
        opacity: 0,
      },
      animations: {
        opacity: timingConfig,
      },
    };
  },
  
  /**
   * Fade out when disappearing
   */
  fadeOut: () => {
    'worklet';
    const timingConfig = {
      duration: TIMING_CONFIGS.exit.duration,
    };
    return {
      initialValues: {
        opacity: 1,
      },
      animations: {
        opacity: timingConfig,
      },
    };
  },
  
  /**
   * Slide up with fade when appearing
   */
  slideUpFadeIn: () => {
    'worklet';
    const timingConfig = {
      duration: TIMING_CONFIGS.entrance.duration,
    };
    return {
      initialValues: {
        opacity: 0,
        transform: [{ translateY: 20 }],
      },
      animations: {
        opacity: timingConfig,
        transform: [{ translateY: timingConfig }],
      },
    };
  },
  
  /**
   * Scale with fade when appearing
   */
  scaleFadeIn: () => {
    'worklet';
    const timingConfig = {
      duration: TIMING_CONFIGS.entrance.duration,
    };
    return {
      initialValues: {
        opacity: 0,
        transform: [{ scale: 0.9 }],
      },
      animations: {
        opacity: timingConfig,
        transform: [{ scale: timingConfig }],
      },
    };
  },
};

/**
 * Shared element transition configuration
 */
export const SharedElementTransition = {
  animation: {
    duration: 300,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
};
