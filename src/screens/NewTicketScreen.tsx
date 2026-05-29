import React, { useEffect, useState } from 'react';
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
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { api } from '../services/api';
import { useAppStore } from '../store';
import { Client } from '../types';

export default function NewTicketScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const existingTicket = route?.params?.ticket;
  const isEditing = !!existingTicket;

  const [title, setTitle] = useState(existingTicket?.title || '');
  const [description, setDescription] = useState(existingTicket?.description || '');
  const [priority, setPriority] = useState(existingTicket?.priority || 'medium');
  const [images, setImages] = useState<string[]>(existingTicket?.images || []);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientPicker, setShowClientPicker] = useState(false);

  useEffect(() => {
    api.getClients().then(setClients).catch(() => {});
    if (existingTicket?.client_id) {
      api.getClients().then((all) => {
        const c = all.find((cl: Client) => cl.id === existingTicket.client_id);
        if (c) setSelectedClient(c);
      }).catch(() => {});
    }
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 0.7 });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert(t('common.error'), t('common.error')); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (uri: string) => setImages((prev) => prev.filter((i) => i !== uri));

  const priorities = [
    { key: 'low', label: t('ticket.low'), color: colors.success },
    { key: 'medium', label: t('ticket.medium'), color: colors.warning },
    { key: 'high', label: t('ticket.high'), color: colors.error },
    { key: 'urgent', label: t('ticket.urgent'), color: '#DC2626' },
  ];

  const handleSave = async () => {
    if (!title) { Alert.alert(t('common.error'), t('errors.required')); return; }
    setLoading(true);
    try {
      const payload: any = { title, description, priority: priority as any, images };
      if (selectedClient) {
        payload.client_id = selectedClient.id;
        payload.client_name = selectedClient.name;
      }
      if (isEditing) {
        await api.updateTicket(existingTicket.id, payload);
        showToast(t('ticket.updatedToast'), 'success');
        navigation.goBack();
      } else {
        await api.createTicket(payload);
        showToast(t('ticket.createdToast'), 'success');
        navigation.goBack();
      }
    } catch (error) {
      showToast(isEditing ? t('ticket.updateError') : t('ticket.createError'), 'error');
    } finally { setLoading(false); }
  };

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? t('common.edit') : t('ticket.new')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label={t('ticket.titleField') + ' *'} placeholder={t('ticket.titleField')} value={title} onChangeText={setTitle} />

        <TouchableOpacity style={[styles.clientSelector, { borderColor: colors.border }]} onPress={() => setShowClientPicker(!showClientPicker)}>
          <Ionicons name="people-outline" size={18} color={selectedClient ? colors.text : colors.textSecondary} />
          <Text style={[styles.clientSelectorText, { color: selectedClient ? colors.text : colors.textSecondary }]}>
            {selectedClient ? selectedClient.name : t('client.name')}
          </Text>
          <Ionicons name={showClientPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {showClientPicker && (
          <View style={[styles.clientList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {clients.length === 0 ? (
              <Text style={[styles.clientEmpty, { color: colors.textTertiary }]}>{t('ticket.noClientsAvailable')}</Text>
            ) : (
              clients.map((c) => (
                <TouchableOpacity key={c.id} style={[styles.clientOption, selectedClient?.id === c.id && { backgroundColor: colors.accent + '10' }]}
                  onPress={() => { setSelectedClient(c); setShowClientPicker(false); }}>
                  <Text style={[styles.clientOptionName, { color: colors.text }]}>{c.name}</Text>
                  {c.phone && <Text style={[styles.clientOptionPhone, { color: colors.textSecondary }]}>{c.phone}</Text>}
                  {selectedClient?.id === c.id && <Ionicons name="checkmark" size={18} color={colors.accent} />}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <Input label={t('ticket.description')} placeholder={t('ticket.description')} multiline numberOfLines={4} value={description} onChangeText={setDescription} />

        <Text style={[styles.label, { color: colors.text }]}>{t('ticket.priority')}</Text>
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
            <Text style={[styles.attachText, { color: colors.textSecondary }]}>{t('ticket.attachPhoto')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.attachButton, { borderColor: colors.border, flex: 1 }]} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={20} color={colors.accent} />
            <Text style={[styles.attachText, { color: colors.textSecondary }]}>{t('ticket.attachPhoto')}</Text>
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

        <Button title={isEditing ? t('common.save') : t('ticket.new')} onPress={handleSave} loading={loading} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </ScreenWrapper>
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
  clientSelector: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1, gap: Spacing.sm, marginBottom: Spacing.xl },
  clientSelectorText: { flex: 1, fontSize: 14 },
  clientList: { borderRadius: BorderRadius.lg, borderWidth: 1, marginTop: -Spacing.lg, marginBottom: Spacing.xl, overflow: 'hidden' },
  clientOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  clientOptionName: { fontSize: 14, fontWeight: '500', flex: 1 },
  clientOptionPhone: { fontSize: 12 },
  clientEmpty: { fontSize: 13, textAlign: 'center', paddingVertical: Spacing.xl },
});
