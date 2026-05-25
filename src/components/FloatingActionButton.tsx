import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface FABProps {
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

export function FloatingActionButton({ icon = 'add', onPress, color }: FABProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color || colors.accent }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 24, right: 20, zIndex: 100 },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
