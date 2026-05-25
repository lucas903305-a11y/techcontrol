import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(lineWidth, {
        toValue: 60,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();

    setTimeout(() => {
      navigation?.replace('Login');
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity, transform: [{ scale }] },
        ]}
      >
        <View style={styles.iconWrapper}>
          <Ionicons name="hardware-chip-outline" size={48} color={Colors.light.white} />
        </View>
        <Text style={styles.title}>
          Tech<Text style={styles.accent}>Control</Text>
        </Text>
      </Animated.View>

      <Animated.View style={{ opacity: subtitleOpacity, alignItems: 'center' }}>
        <Animated.View
          style={[styles.line, { width: lineWidth }]}
        />
        <Text style={styles.subtitle}>
          Gestión inteligente para técnicos IT
        </Text>
      </Animated.View>

      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.light.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.light.white,
    letterSpacing: -1,
  },
  accent: {
    color: Colors.light.accent,
  },
  line: {
    height: 3,
    backgroundColor: Colors.light.accent,
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    letterSpacing: 0.5,
  },
  version: {
    position: 'absolute',
    bottom: 50,
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
});
