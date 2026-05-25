import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { StatCard, Badge } from '../components';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { DashboardStats, Ticket } from '../types';
import { useAppStore } from '../store';
import { formatDate } from '../utils';

export default function DashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const user = useAppStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats>({
    open_tickets: 0, today_jobs: 0, monthly_earnings: 245000,
    recent_clients: 0, completion_rate: 0, avg_response_time: 0,
  });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsData, tickets] = await Promise.all([
        api.getDashboardStats(),
        api.getTickets(),
      ]);
      setStats(statsData);
      setRecentTickets(tickets.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const quickActions = [
    { icon: 'add-circle-outline' as const, label: 'Nuevo ticket', color: colors.accent, screen: 'NewTicket' },
    { icon: 'people-outline' as const, label: 'Nuevo cliente', color: colors.success, screen: 'NewClient' },
    { icon: 'document-text-outline' as const, label: 'Presupuesto', color: colors.warning, screen: 'NewQuote' },
    { icon: 'map-outline' as const, label: 'Mapa', color: colors.error, screen: 'Map' },
  ];

  const statusMap: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'error' }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    in_progress: { label: 'En proceso', variant: 'info' },
    completed: { label: 'Completado', variant: 'success' },
    cancelled: { label: 'Cancelado', variant: 'error' },
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>¡Hola! {user?.name?.split(' ')[0] || ''}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={36} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        {quickActions.map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionButton} onPress={() => navigation.navigate(action.screen)}>
            <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
              <Ionicons name={action.icon} size={22} color={action.color} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Tickets abiertos" value={stats.open_tickets} icon="git-branch-outline" color={colors.warning} loading={loading} />
        <StatCard title="Trabajos hoy" value={stats.today_jobs} icon="calendar-outline" color={colors.accent} loading={loading} />
        <StatCard title="Clientes" value={stats.recent_clients} icon="people-outline" color={colors.success} loading={loading} />
        <StatCard title="Completados" value={`${stats.completion_rate}%`} icon="checkmark-circle-outline" color={colors.info} loading={loading} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tickets recientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tickets')}>
            <Text style={[styles.seeAll, { color: colors.accent }]}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        {recentTickets.length === 0 && !loading && (
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>Sin tickets recientes</Text>
        )}
        {recentTickets.map((ticket) => {
          const st = statusMap[ticket.status] || statusMap.pending;
          return (
            <TouchableOpacity key={ticket.id} style={[styles.ticketItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('TicketDetail', { ticket })}>
              <View style={styles.ticketLeft}>
                <Badge label={st.label} variant={st.variant} />
                <Text style={[styles.ticketTitle, { color: colors.text }]} numberOfLines={1}>{ticket.title}</Text>
                {ticket.client_name && <Text style={[styles.ticketClient, { color: colors.textSecondary }]}>Cliente: {ticket.client_name}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximos trabajos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tickets')}>
            <Text style={[styles.seeAll, { color: colors.accent }]}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.scheduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {recentTickets.filter(t => t.status === 'pending' || t.status === 'in_progress').slice(0, 3).map((ticket, i, arr) => (
            <TouchableOpacity key={ticket.id}
              style={[styles.scheduleItem, i < arr.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 }]}
              onPress={() => navigation.navigate('TicketDetail', { ticket })}>
              <View style={styles.scheduleTime}>
                <Text style={[styles.scheduleTimeText, { color: colors.text }]}>
                  {ticket.scheduled_date ? formatDate(ticket.scheduled_date, 'short') : 'Hoy'}
                </Text>
                <View style={[styles.scheduleDot, { backgroundColor: ticket.priority === 'urgent' ? colors.error : ticket.priority === 'high' ? colors.warning : colors.accent }]} />
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={[styles.scheduleTitle, { color: colors.text }]}>{ticket.title}</Text>
                {ticket.client_name && <Text style={[styles.scheduleClient, { color: colors.textSecondary }]}>{ticket.client_name}</Text>}
              </View>
            </TouchableOpacity>
          ))}
          {recentTickets.filter(t => t.status === 'pending' || t.status === 'in_progress').length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textTertiary, paddingVertical: Spacing.xl }]}>Sin trabajos pendientes</Text>
          )}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: Spacing.massive },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.xl,
  },
  greeting: { fontSize: 22, fontWeight: '700' },
  date: { fontSize: 13, marginTop: 2, textTransform: 'capitalize' },
  profileButton: { padding: 4 },
  quickActions: { flexDirection: 'row', paddingHorizontal: Spacing.xxl, marginBottom: Spacing.xxl, gap: Spacing.md },
  actionButton: { flex: 1, alignItems: 'center' },
  actionIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  actionLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.xxl, gap: Spacing.md, marginBottom: Spacing.xxl },
  section: { paddingHorizontal: Spacing.xxl, marginBottom: Spacing.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '600' },
  seeAll: { fontSize: 13, fontWeight: '500' },
  ticketItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1 },
  ticketLeft: { flex: 1, marginRight: Spacing.md, gap: 4 },
  ticketTitle: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  ticketClient: { fontSize: 12 },
  scheduleCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1 },
  scheduleItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  scheduleTime: { alignItems: 'center', width: 50, marginRight: Spacing.lg },
  scheduleTimeText: { fontSize: 13, fontWeight: '600' },
  scheduleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginTop: 4 },
  scheduleInfo: { flex: 1 },
  scheduleTitle: { fontSize: 14, fontWeight: '600' },
  scheduleClient: { fontSize: 12, marginTop: 2 },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: Spacing.xl },
});
