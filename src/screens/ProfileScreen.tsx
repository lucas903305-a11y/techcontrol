import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store';
import { authService } from '../services/auth';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function ProfileScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  const handleLogout = async () => {
    await authService.signOut();
    logout();
    navigation.replace('Login');
  };

  const menuItems = [
    { icon: 'person-outline', label: t('profile.title'), screen: 'EditProfile' },
    { icon: 'briefcase-outline', label: t('profile.myCompany'), screen: 'Company' },
    { icon: 'card-outline', label: t('profile.billing'), screen: 'Billing' },
    { icon: 'notifications-outline', label: t('profile.notifications'), screen: 'Notifications' },
    { icon: 'shield-checkmark-outline', label: t('profile.security'), screen: 'Security' },
    { icon: 'help-circle-outline', label: t('profile.help'), screen: 'Help' },
    { icon: 'information-circle-outline', label: t('profile.about'), screen: 'About' },
  ];

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name || t('profile.defaultName')}</Text>
          <Text style={[styles.role, { color: colors.textSecondary }]}>{t('profile.role')}</Text>
          <View style={[styles.planBadge, { backgroundColor: colors.accent + '15' }]}>
            <Text style={[styles.planText, { color: colors.accent }]}>{t('profile.planPro')}</Text>
          </View>
        </View>

        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>47</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.jobs')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>4.9</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('profile.rating')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('client.title')}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              accessibilityLabel={item.label}
              style={[styles.menuItem, { borderBottomColor: colors.divider }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons name={item.icon as any} size={20} color={colors.text} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <Button title={t('profile.logout')} variant="outline" onPress={handleLogout} style={styles.logoutButton} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  profileCard: { alignItems: 'center', paddingVertical: Spacing.xxl, marginBottom: Spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  name: { fontSize: 22, fontWeight: '700' },
  role: { fontSize: 14, marginTop: 2 },
  planBadge: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, borderRadius: BorderRadius.round, marginTop: Spacing.md },
  planText: { fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', borderRadius: BorderRadius.lg, padding: Spacing.xl, marginBottom: Spacing.xxl, borderWidth: 1 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1 },
  menuSection: { marginBottom: Spacing.xxl },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, borderBottomWidth: 1 },
  menuLabel: { flex: 1, fontSize: 15, marginLeft: Spacing.md },
  logoutButton: { marginTop: Spacing.md },
});
