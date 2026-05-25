import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { getInitials } from '../utils';

interface AvatarProps {
  name?: string;
  photoUrl?: string;
  size?: number;
  onPress?: () => void;
  showBadge?: boolean;
}

export function Avatar({ name = '', photoUrl, size = 44, onPress, showBadge }: AvatarProps) {
  const { colors } = useTheme();
  const borderRadius = size / 2;

  const content = photoUrl ? (
    <Image source={{ uri: photoUrl }} style={[styles.image, { width: size, height: size, borderRadius }]} />
  ) : (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius, backgroundColor: colors.accent + '20' }]}>
      <Text style={[styles.initials, { fontSize: size * 0.4, color: colors.accent }]}>
        {getInitials(name) || '?'}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
        {showBadge && <View style={[styles.badge, { backgroundColor: colors.success, width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15 }]} />}
      </TouchableOpacity>
    );
  }

  return (
    <View>
      {content}
      {showBadge && <View style={[styles.badge, { backgroundColor: colors.success, width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15 }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  image: { resizeMode: 'cover' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontWeight: '700' },
  badge: { position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#FFFFFF' },
});
