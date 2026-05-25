import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store';

export default function SettingsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  const settingsSections = [
    {
      title: 'Preferencias',
      items: [
        { icon: 'moon-outline', label: 'Modo oscuro', type: 'switch', value: isDarkMode, onToggle: toggleDarkMode },
        { icon: 'notifications-outline', label: 'Notificaciones push', type: 'switch', value: notifications, onToggle: setNotifications },
        { icon: 'volume-high-outline', label: 'Sonido', type: 'switch', value: sound, onToggle: setSound },
      ],
    },
    {
      title: 'Idioma',
      items: [
        { icon: 'language-outline', label: 'Idioma', type: 'select', value: 'Español (Argentina)' },
      ],
    },
    {
      title: 'Moneda',
      items: [
        { icon: 'cash-outline', label: 'Moneda predeterminada', type: 'select', value: 'ARS ($)' },
      ],
    },
    {
      title: 'Datos',
      items: [
        { icon: 'download-outline', label: 'Exportar datos', type: 'action' },
        { icon: 'trash-outline', label: 'Eliminar cuenta', type: 'action', danger: true },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Configuración</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {section.items.map((item, iidx) => (
                <View
                  key={iidx}
                  style={[styles.settingItem, iidx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={(item as any).danger ? colors.error : colors.text}
                    />
                    <Text
                      style={[styles.settingLabel, { color: colors.text }, (item as any).danger && { color: colors.error }]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {(item as any).type === 'switch' ? (
                    <Switch
                      value={(item as any).value}
                      onValueChange={(item as any).onToggle}
                      trackColor={{ false: colors.border, true: colors.accent + '60' }}
                      thumbColor={(item as any).value ? colors.accent : colors.textTertiary}
                    />
                  ) : (
                    <View style={styles.settingRight}>
                      <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{(item as any).value}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  section: { marginBottom: Spacing.xxl },
  sectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: { borderRadius: BorderRadius.lg, borderWidth: 1 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  settingLabel: { fontSize: 15 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  settingValue: { fontSize: 13 },
});
