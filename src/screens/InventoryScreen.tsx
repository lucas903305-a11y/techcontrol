import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button, Badge } from '../components';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { InventoryItem } from '../types';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function InventoryScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadInventory = useCallback(async () => {
    try {
      const data = await api.getInventory();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadInventory(); }, [loadInventory]));

  const [stockFilter, setStockFilter] = useState('all');

  const filtered = (stockFilter === 'low' ? items.filter((i) => i.quantity <= i.min_stock) : items)
    .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category?.toLowerCase().includes(search.toLowerCase()));

  const stockFilters = [
    { key: 'all', label: t('common.all') },
    { key: 'low', label: `${t('inventory.lowStockFilter')} (${items.filter((i) => i.quantity <= i.min_stock).length})` },
  ];

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('NewInventory', { item })}
    >
      <View style={styles.itemHeader}>
        <View style={[styles.itemIcon, { backgroundColor: colors.accent + '15' }]}>
          <Ionicons name={item.category === 'cables' ? 'git-network-outline' : 'cube-outline'} size={20} color={colors.accent} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>{item.category || t('inventory.general')}</Text>
        </View>
      </View>
      <View style={styles.itemFooter}>
        <View style={styles.quantityRow}>
          <Text style={[styles.quantity, { color: item.quantity <= item.min_stock ? colors.error : colors.success }]}>{item.quantity}</Text>
          <Text style={[styles.unit, { color: colors.textSecondary }]}>{item.unit}</Text>
        </View>
        {item.quantity <= item.min_stock && <Badge label={t('inventory.lowStock')} variant="error" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('inventory.title')}</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <TouchableOpacity><Ionicons name="qr-code-outline" size={24} color={colors.accent} /></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('NewInventory')}><Ionicons name="add-circle" size={24} color={colors.accent} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <Input placeholder={t('inventory.searchPlaceholder')} value={search} onChangeText={setSearch} containerStyle={styles.searchInput} />
      </View>

      <View style={styles.filterContainer}>
        {stockFilters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, { backgroundColor: stockFilter === f.key ? colors.accent : colors.surface, borderColor: stockFilter === f.key ? colors.accent : colors.border }]}
            onPress={() => setStockFilter(f.key)}
          >
            <Text style={[styles.filterText, { color: stockFilter === f.key ? '#FFFFFF' : colors.textSecondary }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && items.length === 0 ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: Spacing.massive }} />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInventory} tintColor={colors.accent} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                {search ? t('inventory.noSearchResults') : t('inventory.empty')}
              </Text>
              {!search && <Button title={t('inventory.addProduct')} onPress={() => navigation.navigate('NewInventory')} />}
            </View>
          }
        />
      )}
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
  itemCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  itemIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600' },
  itemCategory: { fontSize: 12, marginTop: 1 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quantityRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  quantity: { fontSize: 20, fontWeight: '700' },
  unit: { fontSize: 12 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: Spacing.xxl, marginBottom: Spacing.lg, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '500' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.massive, gap: Spacing.lg },
  emptyText: { fontSize: 15 },
});
