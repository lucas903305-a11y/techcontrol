import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { StatCard } from '../components';

export default function AdminScreen({ navigation }: any) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Panel Admin</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard title="Usuarios totales" value="24" icon="people-outline" color={colors.accent} />
          <StatCard title="Suscripciones Pro" value="12" icon="card-outline" color={colors.success} />
          <StatCard title="Tickets hoy" value="8" icon="git-branch-outline" color={colors.warning} />
          <StatCard title="Ingresos mes" value="$320K" icon="cash-outline" color={colors.info} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Gestión</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
              <Ionicons name="people-outline" size={20} color={colors.text} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Usuarios</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Roles y permisos</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
              <Ionicons name="stats-chart-outline" size={20} color={colors.text} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Estadísticas globales</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
              <Ionicons name="settings-outline" size={20} color={colors.text} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Configuración general</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="card-outline" size={20} color={colors.text} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Suscripciones</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Técnicos más activos</Text>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={[styles.techRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.techAvatar, { backgroundColor: colors.accent + '20' }]}>
                <Text style={[styles.techAvatarText, { color: colors.accent }]}>T{i + 1}</Text>
              </View>
              <View style={styles.techInfo}>
                <Text style={[styles.techName, { color: colors.text }]}>Técnico {i + 1}</Text>
                <Text style={[styles.techTickets, { color: colors.textSecondary }]}>{12 - i * 3} tickets resueltos</Text>
              </View>
              <View style={[styles.techBadge, { backgroundColor: colors.warning + '20' }]}>
                <Text style={[styles.techBadgeText, { color: colors.warning }]}>#{i + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xxl },
  section: { marginBottom: Spacing.xxl },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: Spacing.lg },
  sectionCard: { borderRadius: BorderRadius.lg, borderWidth: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderBottomWidth: 1 },
  menuLabel: { flex: 1, fontSize: 15, marginLeft: Spacing.md },
  techRow: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1 },
  techAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  techAvatarText: { fontSize: 14, fontWeight: '700' },
  techInfo: { flex: 1 },
  techName: { fontSize: 14, fontWeight: '600' },
  techTickets: { fontSize: 12, marginTop: 1 },
  techBadge: { paddingHorizontal: Spacing.md, paddingVertical: 2, borderRadius: BorderRadius.round },
  techBadgeText: { fontSize: 12, fontWeight: '700' },
});
