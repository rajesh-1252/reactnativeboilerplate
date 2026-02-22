import { tokens } from '@/theme/tokens';
import { useTheme } from '@tamagui/core';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

/**
 * Styled TextInput component with label, error, and icon support
 */
export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  
  // Resolve colors using proper Tamagui theme keys from tamagui.config.ts
  const borderColorValue = error
    ? theme.error?.get()
    : isFocused
    ? theme.primary?.get() || theme.blue?.get()
    : theme.borderColor?.get() || theme.border?.get(); // Fallback to borderColor
    
  const backgroundColorValue = theme.surface?.get() || theme.background?.get();
  const textColorValue = theme.color?.get(); // maps to palette.text
  const placeholderColorValue = theme.placeholderColor?.get() || theme.textMuted?.get();
  
  return (
    <View style={styles.container}>
      {label && (
        <Text variant="caption" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={[styles.inputContainer, { borderColor: borderColorValue, backgroundColor: backgroundColorValue }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            { color: textColorValue },
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
          ]}
          placeholderTextColor={placeholderColorValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
            {rightIcon}
          </Pressable>
        )}
      </View>
      
      {(error || hint) && (
        <Text
          variant="caption"
          style={[
            styles.helpText,
            { color: error ? theme.error?.get() : theme.textMuted?.get() },
          ]}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.space[4],
  },
  label: {
    marginBottom: tokens.space[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: tokens.radius[2],
  },
  input: {
    flex: 1,
    fontSize: tokens.size.md,
    paddingVertical: tokens.space[3],
    paddingHorizontal: tokens.space[4],
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    paddingLeft: tokens.space[4],
  },
  rightIcon: {
    paddingRight: tokens.space[4],
    paddingVertical: tokens.space[3],
  },
  helpText: {
    marginTop: tokens.space[1],
  },
});

export default Input;
