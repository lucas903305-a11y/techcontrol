import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', size = 'sm', style }: BadgeProps) {
  const { colors, isDark } = useTheme();

  const colorMap = {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    default: colors.textSecondary,
  };

  const lightBg: Record<string, string> = {
    success: '#D1FAE5',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: '#DBEAFE',
    default: '#F1F5F9',
  };

  const darkBg: Record<string, string> = {
    success: '#064E3B',
    warning: '#78350F',
    error: '#7F1D1D',
    info: '#1E3A5F',
    default: '#1E293B',
  };

  const bgMap = isDark ? darkBg : lightBg;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgMap[variant],
          paddingHorizontal: size === 'sm' ? Spacing.sm : Spacing.md,
          paddingVertical: size === 'sm' ? 2 : Spacing.xs,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: colorMap[variant],
            fontSize: size === 'sm' ? 11 : 13,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
