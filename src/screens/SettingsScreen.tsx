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
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function SettingsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const showToast = useAppStore((s) => s.showToast);
  const logout = useAppStore((s) => s.logout);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  const toggleLanguage = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
    showToast(locale === 'es' ? t('settings.languageChangedToEnglish') : t('settings.languageChangedToSpanish'), 'success');
  };

  const settingsSections = [
    {
      title: t('settings.preferences'),
      items: [
        { icon: 'moon-outline', label: t('settings.darkMode'), type: 'switch', value: isDarkMode, onToggle: toggleDarkMode },
        { icon: 'notifications-outline', label: t('settings.pushNotifications'), type: 'switch', value: notifications, onToggle: setNotifications },
        { icon: 'volume-high-outline', label: t('settings.sound'), type: 'switch', value: sound, onToggle: setSound },
      ],
    },
    {
      title: t('settings.language'),
      items: [
        { icon: 'language-outline', label: t('settings.language'), type: 'select', value: locale === 'es' ? 'Español' : 'English', onPress: toggleLanguage },
      ],
    },
    {
      title: t('settings.currency'),
      items: [
        { icon: 'cash-outline', label: t('settings.currency'), type: 'select', value: 'ARS ($)' },
      ],
    },
    {
      title: t('settings.data'),
      items: [
        { icon: 'download-outline', label: t('settings.exportData'), type: 'action', onPress: () => showToast(t('common.loading'), 'info') },
        { icon: 'trash-outline', label: t('settings.deleteAccount'), type: 'action', danger: true, onPress: () => Alert.alert(t('settings.deleteAccount'), locale === 'es' ? '¿Estás seguro? Esta acción no se puede deshacer.' : 'Are you sure? This action cannot be undone.', [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.delete'), style: 'destructive', onPress: () => { logout(); navigation.navigate('Login'); }},
        ]) },
      ],
    },
  ];

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity accessibilityLabel="back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
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
                  ) : (item as any).type === 'action' ? (
                    <TouchableOpacity accessibilityLabel={item.label} style={styles.settingRight} onPress={(item as any).onPress}>
                      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity accessibilityLabel={item.label} style={styles.settingRight} onPress={(item as any).onPress}>
                      <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{(item as any).value}</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
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
