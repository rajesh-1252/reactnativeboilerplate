import { tokens } from '@/theme/tokens';
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
  
  const borderColor = error
    ? tokens.color.error
    : isFocused
    ? tokens.color.primary
    : tokens.color.border;
  
  return (
    <View style={styles.container}>
      {label && (
        <Text variant="caption" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={[styles.inputContainer, { borderColor }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
          ]}
          placeholderTextColor={tokens.color.textMuted}
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
            { color: error ? tokens.color.error : tokens.color.textMuted },
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
    color: tokens.color.textSecondary,
    marginBottom: tokens.space[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.color.surface,
    borderWidth: 1,
    borderRadius: tokens.radius[2],
  },
  input: {
    flex: 1,
    color: tokens.color.text,
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
