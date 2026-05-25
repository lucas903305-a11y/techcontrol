import React, { useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { Spacing } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message, fullScreen }: LoadingProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.content, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.accent} />
      {message && <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>}
    </View>
  );

  if (fullScreen) {
    return <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>{content}</View>;
  }

  return content;
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  fullScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 14, marginTop: Spacing.md, textAlign: 'center' },
});
