import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { hapticLight } from '../utils/haptics';
import { useTheme } from '../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();

  const bgColor = {
    primary: colors.accent,
    secondary: colors.primary,
    outline: 'transparent',
    ghost: 'transparent',
  }[variant];

  const textColor = {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    outline: colors.accent,
    ghost: colors.accent,
  }[variant];

  const borderColor = variant === 'outline' ? colors.accent : 'transparent';

  const height = {
    sm: 40,
    md: 50,
    lg: 56,
  }[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          height,
          borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={() => { hapticLight(); onPress(); }}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: size === 'sm' ? 13 : 15,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
