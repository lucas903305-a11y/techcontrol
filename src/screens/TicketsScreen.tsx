import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Badge, Button, Input } from '../components';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { Ticket } from '../types';

const statusLabels: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'error' }> = {
  pending: { label: 'Pendiente', variant: 'warning' },
  in_progress: { label: 'En proceso', variant: 'info' },
  completed: { label: 'Completado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'error' },
};

export default function TicketsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadTickets = useCallback(async () => {
    try {
      const data = await api.getTickets();
      setTickets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadTickets(); }, [loadTickets]));

  const filtered = (filter === 'all' ? tickets : tickets.filter((t) => t.status === filter))
    .filter((t) =>
      !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );

  const renderTicket = ({ item }: { item: Ticket }) => {
    const status = statusLabels[item.status];
    return (
      <TouchableOpacity
        style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
      >
        <View style={styles.ticketHeader}>
          <Badge label={status.label} variant={status.variant} />
          <View style={[styles.priorityDot, { backgroundColor: item.priority === 'low' ? colors.textSecondary : item.priority === 'medium' ? colors.warning : item.priority === 'high' ? colors.error : '#DC2626' }]} />
        </View>
        <Text style={[styles.ticketTitle, { color: colors.text }]}>{item.title}</Text>
        {item.client_name && <Text style={[styles.ticketClient, { color: colors.textSecondary }]}>Cliente: {item.client_name}</Text>}
        <View style={styles.ticketFooter}>
          <View style={styles.ticketMeta}>
            <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{new Date(item.created_at).toLocaleDateString('es-AR')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filters = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'in_progress', label: 'En proceso' },
    { key: 'completed', label: 'Completadas' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tickets</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewTicket')}>
          <Ionicons name="add-circle" size={28} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <Input placeholder="Buscar ticket..." value={search} onChangeText={setSearch} containerStyle={styles.searchInput} />
      </View>

      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, { backgroundColor: filter === f.key ? colors.accent : colors.surface, borderColor: filter === f.key ? colors.accent : colors.border }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? '#FFFFFF' : colors.textSecondary }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTickets} tintColor={colors.accent} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="git-branch-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              {search ? 'Sin resultados para esta búsqueda' : `No hay tickets ${filter !== 'all' ? statusLabels[filter]?.label.toLowerCase() : ''}`}
            </Text>
            {!search && <Button title="Crear ticket" onPress={() => navigation.navigate('NewTicket')} />}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xxl, marginBottom: Spacing.md },
  searchIcon: { marginRight: -Spacing.lg, zIndex: 1 },
  searchInput: { flex: 1, marginBottom: 0 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: Spacing.xxl, marginBottom: Spacing.lg, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '500' },
  list: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  ticketCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  ticketTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  ticketClient: { fontSize: 12, marginBottom: Spacing.sm },
  ticketFooter: { flexDirection: 'row', gap: Spacing.lg },
  ticketMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.massive, gap: Spacing.lg },
  emptyText: { fontSize: 15 },
});
