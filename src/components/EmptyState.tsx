import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'cube-outline', title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceLight }]}>
        <Ionicons name={icon} size={40} color={colors.textTertiary} />
      </View>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      {message && <Text style={[styles.message, { color: colors.textTertiary }]}>{message}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} size="sm" style={{ marginTop: Spacing.lg }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.massive, paddingHorizontal: Spacing.xxl },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  title: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: Spacing.xs },
  message: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
