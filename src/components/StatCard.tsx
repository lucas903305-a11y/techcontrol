import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
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
}

export function StatCard({ title, value, icon, color, loading, style }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }, style]}>
      <View
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
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : (
        <Text style={[styles.value, { color: color || colors.text }]}>
          {value}
        </Text>
      )}
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
    </View>
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
