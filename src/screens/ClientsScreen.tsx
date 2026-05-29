import React, { useCallback, useState } from 'react';
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
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { openWhatsApp } from '../utils';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { api } from '../services/api';
import { Client } from '../types';

export default function ClientsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadClients = useCallback(async () => {
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadClients(); }, [loadClients]));

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
  );

  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={[styles.clientCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('ClientDetail', { client: item })}
    >
      <View style={[styles.clientAvatar, { backgroundColor: colors.accent + '20' }]}>
        <Text style={[styles.avatarText, { color: colors.accent }]}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.clientInfo}>
        <Text style={[styles.clientName, { color: colors.text }]}>{item.name}</Text>
        {item.phone && (
          <View style={styles.clientRow}>
            <Ionicons name="call-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.clientDetail, { color: colors.textSecondary }]}>{item.phone}</Text>
          </View>
        )}
        {item.address && (
          <View style={styles.clientRow}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={[styles.clientDetail, { color: colors.textSecondary }]} numberOfLines={1}>{item.address}</Text>
          </View>
        )}
      </View>
      <View style={styles.clientActions}>
        <TouchableOpacity style={styles.whatsappBtn} onPress={() => item.phone && openWhatsApp(item.phone)}>
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('client.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewClient')}>
          <Ionicons name="add-circle" size={28} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <Input placeholder={t('common.search')} value={search} onChangeText={setSearch} containerStyle={styles.searchInput} />
      </View>

      <FlatList
        data={filteredClients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadClients} tintColor={colors.accent} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              {search ? t('common.empty') : t('client.noClients')}
            </Text>
            {!search && <Button title={t('client.new')} onPress={() => navigation.navigate('NewClient')} />}
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xxl, marginBottom: Spacing.md },
  searchIcon: { marginRight: -Spacing.lg, zIndex: 1 },
  searchInput: { flex: 1, marginBottom: 0 },
  list: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  clientCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1 },
  clientAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  avatarText: { fontSize: 18, fontWeight: '700' },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  clientDetail: { fontSize: 12, flex: 1 },
  clientActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  whatsappBtn: { padding: 6 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.massive, gap: Spacing.lg },
  emptyText: { fontSize: 15 },
});
