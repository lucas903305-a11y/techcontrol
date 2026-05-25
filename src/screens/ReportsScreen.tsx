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
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { Ticket } from '../types';

export default function ReportsScreen({ navigation }: any) {
  const { colors } = useTheme();
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
    { icon: 'checkmark-done-outline', label: 'Tickets resueltos', color: colors.accent, desc: `${resolved} de ${tickets.length} (${resolvedRate}%)` },
    { icon: 'git-branch-outline', label: 'Pendientes', color: colors.warning, desc: `${pending} sin asignar` },
    { icon: 'time-outline', label: 'En progreso', color: colors.info, desc: `${inProgress} en curso` },
    { icon: 'calendar-outline', label: 'Historial mensual', color: '#8B5CF6', desc: 'Comparativa mensual' },
    { icon: 'people-outline', label: 'Clientes activos', color: colors.success, desc: `${stats?.recent_clients || 0} registrados` },
    { icon: 'trending-up-outline', label: 'Exportar datos', color: colors.error, desc: 'Excel o PDF' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reportes</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: Spacing.massive }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor={colors.accent} />}
        >
          <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
            <Text style={[styles.summaryLabel, { color: '#94A3B8' }]}>Ganancias del mes</Text>
            <Text style={styles.summaryValue}>$ {stats?.monthly_earnings?.toLocaleString('es-AR') || '0'}</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="trending-up" size={16} color={colors.success} />
              <Text style={[styles.summaryChange, { color: colors.success }]}>
                {resolvedRate}% completado
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.warning }]}>{stats?.open_tickets || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Abiertos</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.accent }]}>{stats?.today_jobs || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hoy</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.success }]}>{stats?.recent_clients || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Clientes</Text>
            </View>
          </View>

          {reportTypes.map((report, index) => (
            <TouchableOpacity key={index} style={[styles.reportCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
    </View>
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
