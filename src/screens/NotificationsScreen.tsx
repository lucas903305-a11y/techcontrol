import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [settings, setSettings] = React.useState({
    nuevosTickets: true,
    cambiosEstado: true,
    recordatorios: true,
    promociones: false,
    sonido: true,
    vibrar: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rows = [
    { key: 'nuevosTickets' as const, icon: 'git-branch-outline', label: t('notifications.newTickets') },
    { key: 'cambiosEstado' as const, icon: 'swap-horizontal-outline', label: t('notifications.statusChanges') },
    { key: 'recordatorios' as const, icon: 'alarm-outline', label: t('notifications.reminders') },
    { key: 'promociones' as const, icon: 'megaphone-outline', label: t('notifications.promotions') },
    { key: 'sonido' as const, icon: 'volume-high-outline', label: t('notifications.sound') },
    { key: 'vibrar' as const, icon: 'phone-portrait-outline', label: t('notifications.vibration') },
  ];

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.notifications')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {rows.map((row, i) => (
            <View key={row.key} style={[styles.row, i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <View style={styles.rowLeft}>
                <Ionicons name={row.icon as any} size={20} color={colors.text} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>{row.label}</Text>
              </View>
              <Switch
                value={settings[row.key]}
                onValueChange={() => toggle(row.key)}
                trackColor={{ false: colors.border, true: colors.accent + '60' }}
                thumbColor={settings[row.key] ? colors.accent : colors.textTertiary}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
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
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  card: { borderRadius: BorderRadius.lg, borderWidth: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowLabel: { fontSize: 15 },
});
