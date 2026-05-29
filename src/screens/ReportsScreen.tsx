import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store';
import { api } from '../services/api';
import { Ticket } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function ReportsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t, locale } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const user = useAppStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      const [s, t] = await Promise.all([api.getDashboardStats(), api.getTickets()]);
      setStats(s);
      setTickets(t);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resolved = tickets.filter((t) => t.status === 'completed').length;
  const pending = tickets.filter((t) => t.status === 'pending').length;
  const inProgress = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedRate = tickets.length > 0 ? Math.round((resolved / tickets.length) * 100) : 0;

  const reportTypes = [
    { icon: 'checkmark-done-outline', label: t('reports.resolvedTickets'), color: colors.accent, desc: `${resolved} ${t('reports.of')} ${tickets.length} (${resolvedRate}%)`, action: () => showToast(`${resolved} ${t('reports.ticketsCompleted')}`, 'success') },
    { icon: 'git-branch-outline', label: t('reports.pendingLabel'), color: colors.warning, desc: `${pending} ${t('reports.unassigned')}`, action: () => showToast(`${pending} ${t('reports.ticketsPendingToast')}`, 'info') },
    { icon: 'time-outline', label: t('reports.inProgressLabel'), color: colors.info, desc: `${inProgress} ${t('reports.inCourse')}`, action: () => showToast(`${inProgress} ${t('reports.inProgressToast')}`, 'info') },
    { icon: 'calendar-outline', label: t('reports.monthlyHistory'), color: '#8B5CF6', desc: t('reports.monthlyComparison'), action: () => showToast(t('reports.monthlyHistoryComing'), 'info') },
    { icon: 'people-outline', label: t('reports.activeClients'), color: colors.success, desc: `${stats?.recent_clients || 0} ${t('reports.registered')}`, action: () => showToast(`${stats?.recent_clients || 0} ${t('reports.activeClientsToast')}`, 'success') },
    { icon: 'trending-up-outline', label: t('reports.export'), color: colors.error, desc: t('reports.excelOrPdf'), action: () => showToast(t('reports.exportComing'), 'info') },
  ];

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('reports.title')}</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: Spacing.massive }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor={colors.accent} />}
        >
          <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
            <Text style={[styles.summaryLabel, { color: '#94A3B8' }]}>{t('reports.monthlyEarnings')}</Text>
            <Text style={styles.summaryValue}>$ {stats?.monthly_earnings?.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR') || '0'}</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="trending-up" size={16} color={colors.success} />
              <Text style={[styles.summaryChange, { color: colors.success }]}>
                {resolvedRate}{t('reports.completedRate')}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.warning }]}>{stats?.open_tickets || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('reports.open')}</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.accent }]}>{stats?.today_jobs || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('reports.today')}</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.success }]}>{stats?.recent_clients || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('reports.clientsStat')}</Text>
            </View>
          </View>

          {reportTypes.map((report, index) => (
            <TouchableOpacity key={index} style={[styles.reportCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={report.action}>
              <View style={[styles.reportIcon, { backgroundColor: `${report.color}15` }]}>
                <Ionicons name={report.icon as any} size={22} color={report.color} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={[styles.reportLabel, { color: colors.text }]}>{report.label}</Text>
                <Text style={[styles.reportDesc, { color: colors.textSecondary }]}>{report.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  summaryCard: { borderRadius: BorderRadius.xl, padding: Spacing.xxl, marginBottom: Spacing.xxl },
  summaryLabel: { fontSize: 13, marginBottom: Spacing.xs },
  summaryValue: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1, marginBottom: Spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  summaryChange: { fontSize: 12, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  statBox: { flex: 1, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  reportCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1 },
  reportIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  reportInfo: { flex: 1 },
  reportLabel: { fontSize: 15, fontWeight: '600' },
  reportDesc: { fontSize: 12, marginTop: 1 },
});
