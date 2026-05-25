import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { useAppStore } from '../store';

const categories = ['cables', 'conectores', 'cámaras', 'accesorios', 'herramientas', 'redes', 'seguridad', 'otros'];

export default function NewInventoryScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const showToast = useAppStore((s) => s.showToast);
  const existing = route?.params?.item;
  const isEditing = !!existing;

  const [name, setName] = useState(existing?.name || '');
  const [quantity, setQuantity] = useState(existing?.quantity?.toString() || '1');
  const [minStock, setMinStock] = useState(existing?.min_stock?.toString() || '5');
  const [unit, setUnit] = useState(existing?.unit || 'unidad');
  const [price, setPrice] = useState(existing?.price?.toString() || '');
  const [category, setCategory] = useState(existing?.category || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Error', 'El nombre es obligatorio'); return; }
    setLoading(true);
    try {
      if (isEditing) {
        await api.updateInventoryItem(existing.id, { name, quantity: parseInt(quantity) || 0, min_stock: parseInt(minStock) || 0, unit, price: parseFloat(price) || 0, category });
        showToast('Producto actualizado', 'success');
      } else {
        await api.createInventoryItem({ name, quantity: parseInt(quantity) || 0, min_stock: parseInt(minStock) || 0, unit, price: parseFloat(price) || 0, category });
        showToast('Producto agregado', 'success');
      }
      navigation.goBack();
    } catch {
      showToast(isEditing ? 'No se pudo actualizar' : 'No se pudo agregar', 'error');
    } finally { setLoading(false); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? 'Editar producto' : 'Nuevo producto'}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label="Nombre del producto *" placeholder="Ej: Cable UTP CAT6" value={name} onChangeText={setName} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input label="Cantidad" placeholder="1" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Stock mínimo" placeholder="5" keyboardType="numeric" value={minStock} onChangeText={setMinStock} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input label="Unidad" placeholder="unidad" value={unit} onChangeText={setUnit} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Precio unitario" placeholder="0" keyboardType="numeric" value={price} onChangeText={setPrice} />
          </View>
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Categoría</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                { backgroundColor: category === cat ? colors.accent + '20' : colors.surface, borderColor: category === cat ? colors.accent : colors.border },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, { color: category === cat ? colors.accent : colors.textSecondary }]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title={isEditing ? 'Actualizar producto' : 'Guardar producto'} onPress={handleSave} loading={loading} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
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
  row: { flexDirection: 'row', gap: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.sm },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: { fontSize: 13, fontWeight: '500' },
});
