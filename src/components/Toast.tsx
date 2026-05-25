import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onDismiss?: () => void;
  duration?: number;
}

const icons: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
};

export function Toast({ visible, message, type = 'info', onDismiss, duration = 3000 }: ToastProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const colorMap: Record<ToastType, string> = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.accent,
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
          ]).start(() => onDismiss?.());
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }], backgroundColor: colors.surface, borderLeftColor: colorMap[type], shadowColor: colors.shadow }]}>
      <View style={[styles.iconContainer, { backgroundColor: colorMap[type] + '15' }]}>
        <Ionicons name={icons[type]} size={20} color={colorMap[type]} />
      </View>
      <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 9999,
    gap: Spacing.md,
  },
  iconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  message: { flex: 1, fontSize: 14, fontWeight: '500' },
});
