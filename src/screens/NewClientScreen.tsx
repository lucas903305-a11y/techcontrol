import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { useAppStore } from '../store';

export default function NewClientScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const showToast = useAppStore((s) => s.showToast);
  const existingClient = route?.params?.client;
  const isEditing = !!existingClient;

  const [name, setName] = useState(existingClient?.name || '');
  const [phone, setPhone] = useState(existingClient?.phone || '');
  const [email, setEmail] = useState(existingClient?.email || '');
  const [address, setAddress] = useState(existingClient?.address || '');
  const [notes, setNotes] = useState(existingClient?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) { Alert.alert('Error', 'El nombre es obligatorio'); return; }
    setLoading(true);
    try {
      if (isEditing) {
        await api.updateClient(existingClient.id, { name, phone, email, address, notes });
        showToast('Cliente actualizado', 'success');
        navigation.goBack();
      } else {
        await api.createClient({ name, phone, email, address, notes });
        showToast('Cliente creado', 'success');
        navigation.goBack();
      }
    } catch (error) {
      showToast(isEditing ? 'No se pudo actualizar el cliente' : 'No se pudo crear el cliente', 'error');
    } finally { setLoading(false); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? 'Editar cliente' : 'Nuevo cliente'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label="Nombre *" placeholder="Nombre completo" value={name} onChangeText={setName} />
        <Input label="Teléfono" placeholder="+54 11 2345-6789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <Input label="Email" placeholder="cliente@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Input label="Dirección" placeholder="Calle y número" value={address} onChangeText={setAddress} />

        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="map-outline" size={18} color={colors.accent} />
          <Text style={[styles.mapText, { color: colors.accent }]}>Seleccionar en mapa</Text>
        </TouchableOpacity>

        <Input label="Notas internas" placeholder="Observaciones..." multiline numberOfLines={3} value={notes} onChangeText={setNotes} />
        <Button title={isEditing ? 'Actualizar cliente' : 'Guardar cliente'} onPress={handleSave} loading={loading} style={{ marginTop: Spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  mapButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, marginBottom: Spacing.lg },
  mapText: { fontSize: 14, fontWeight: '500' },
});
