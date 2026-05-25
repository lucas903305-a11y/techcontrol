import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

export default function PlaceholderScreen({ navigation, route }: any) {
  const screenName = route?.params?.title || 'En desarrollo';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{screenName}</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={64} color={Colors.light.textTertiary} />
        <Text style={styles.title}>Próximamente</Text>
        <Text style={styles.subtitle}>Esta pantalla está en desarrollo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.light.text },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  title: { fontSize: 20, fontWeight: '700', color: Colors.light.text },
  subtitle: { fontSize: 14, color: Colors.light.textSecondary },
});
