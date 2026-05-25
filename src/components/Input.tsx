import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          { backgroundColor: colors.inputBackground, color: colors.text, borderColor: error ? colors.error : colors.border },
          props.multiline && styles.multiline,
        ]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    letterSpacing: 0.2,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1.5,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  error: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
