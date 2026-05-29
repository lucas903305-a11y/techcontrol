import React from 'react';
import {
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  loading?: boolean;
  style?: ViewStyle;
  index?: number;
}

export function StatCard({ title, value, icon, color, loading, style, index = 0 }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400).springify()}
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }, style]}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          { backgroundColor: color ? `${color}15` : `${colors.accent}15` },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={color || colors.accent}
        />
      </Animated.View>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : (
        <Text style={[styles.value, { color: color || colors.text }]}>
          {value}
        </Text>
      )}
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flex: 1,
    minWidth: '45%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
  },
});
