import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
}

export function Card({ children, onPress, style, padding = 'lg' }: CardProps) {
  const { colors } = useTheme();
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[{ backgroundColor: colors.surface, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: colors.border, padding: Spacing[padding] }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ icon, title, subtitle, action }: CardHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={cardHeaderStyles.row}>
      <View style={cardHeaderStyles.left}>
        {icon && <Ionicons name={icon} size={18} color={colors.accent} style={{ marginRight: Spacing.sm }} />}
        <View>
          <Text style={[cardHeaderStyles.title, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[cardHeaderStyles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {action}
    </View>
  );
}

const cardHeaderStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 12, marginTop: 1 },
});
