import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { useAppStore } from '../store';

export default function NewTicketScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const showToast = useAppStore((s) => s.showToast);
  const existingTicket = route?.params?.ticket;
  const isEditing = !!existingTicket;

  const [title, setTitle] = useState(existingTicket?.title || '');
  const [description, setDescription] = useState(existingTicket?.description || '');
  const [priority, setPriority] = useState(existingTicket?.priority || 'medium');
  const [images, setImages] = useState<string[]>(existingTicket?.images || []);
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 0.7 });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara'); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (uri: string) => setImages((prev) => prev.filter((i) => i !== uri));

  const priorities = [
    { key: 'low', label: 'Baja', color: colors.success },
    { key: 'medium', label: 'Media', color: colors.warning },
    { key: 'high', label: 'Alta', color: colors.error },
    { key: 'urgent', label: 'Urgente', color: '#DC2626' },
  ];

  const handleSave = async () => {
    if (!title) { Alert.alert('Error', 'El título es obligatorio'); return; }
    setLoading(true);
    try {
      if (isEditing) {
        await api.updateTicket(existingTicket.id, { title, description, priority: priority as any });
        showToast('Ticket actualizado', 'success');
        navigation.goBack();
      } else {
        await api.createTicket({ title, description, priority: priority as any });
        showToast('Ticket creado', 'success');
        navigation.goBack();
      }
    } catch (error) {
      showToast(isEditing ? 'No se pudo actualizar el ticket' : 'No se pudo crear el ticket', 'error');
    } finally { setLoading(false); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? 'Editar ticket' : 'Nuevo ticket'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label="Título *" placeholder="Ej: Instalación de cámara" value={title} onChangeText={setTitle} />
        <Input label="Descripción" placeholder="Describí el problema o trabajo a realizar..." multiline numberOfLines={4} value={description} onChangeText={setDescription} />

        <Text style={[styles.label, { color: colors.text }]}>Prioridad</Text>
        <View style={styles.priorityRow}>
          {priorities.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[styles.priorityChip, { borderColor: priority === p.key ? p.color : colors.border }, priority === p.key && { backgroundColor: `${p.color}20` }]}
              onPress={() => setPriority(p.key)}
            >
              <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
              <Text style={[styles.priorityText, { color: priority === p.key ? p.color : colors.textSecondary }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.attachRow}>
          <TouchableOpacity style={[styles.attachButton, { borderColor: colors.border, flex: 1 }]} onPress={pickImages}>
            <Ionicons name="images-outline" size={20} color={colors.accent} />
            <Text style={[styles.attachText, { color: colors.textSecondary }]}>Galería</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.attachButton, { borderColor: colors.border, flex: 1 }]} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={20} color={colors.accent} />
            <Text style={[styles.attachText, { color: colors.textSecondary }]}>Cámara</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewRow}>
            {images.map((uri, i) => (
              <View key={i} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(uri)}>
                  <Ionicons name="close-circle" size={22} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <Button title={isEditing ? 'Actualizar ticket' : 'Crear ticket'} onPress={handleSave} loading={loading} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  label: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.sm },
  priorityRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  priorityChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round, borderWidth: 1.5, gap: 6 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: 13, fontWeight: '500' },
  attachRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  attachButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1.5, borderStyle: 'dashed', gap: Spacing.sm },
  attachText: { fontSize: 14 },
  imagePreviewRow: { marginBottom: Spacing.lg },
  imagePreviewContainer: { position: 'relative', marginRight: Spacing.sm },
  imagePreview: { width: 80, height: 80, borderRadius: BorderRadius.md },
  removeImageBtn: { position: 'absolute', top: -6, right: -6 },
});
