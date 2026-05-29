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
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { api } from '../services/api';
import { useAppStore } from '../store';

export default function NewClientScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const existingClient = route?.params?.client;
  const isEditing = !!existingClient;

  const [name, setName] = useState(existingClient?.name || '');
  const [phone, setPhone] = useState(existingClient?.phone || '');
  const [email, setEmail] = useState(existingClient?.email || '');
  const [address, setAddress] = useState(existingClient?.address || '');
  const [lat, setLat] = useState<number | undefined>(existingClient?.lat);
  const [lng, setLng] = useState<number | undefined>(existingClient?.lng);
  const [notes, setNotes] = useState(existingClient?.notes || '');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (route?.params?.pickedAddress) {
      setAddress(route.params.pickedAddress);
      setLat(route.params.pickedLat);
      setLng(route.params.pickedLng);
    }
  }, [route?.params?.pickedAddress]);

  const handleOpenMap = () => {
    navigation.navigate('MapPicker', { lat, lng });
  };

  const handleSave = async () => {
    if (!name) { Alert.alert(t('common.error'), t('errors.required')); return; }
    setLoading(true);
    try {
      const payload = { name, phone, email, address, notes, lat, lng };
      if (isEditing) {
        await api.updateClient(existingClient.id, payload);
        showToast(t('common.success'), 'success');
        navigation.goBack();
      } else {
        await api.createClient(payload);
        showToast(t('common.success'), 'success');
        navigation.goBack();
      }
    } catch (error) {
      showToast(t('common.error'), 'error');
    } finally { setLoading(false); }
  };

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? t('client.edit') : t('client.new')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label={t('client.name') + ' *'} placeholder={t('client.name')} value={name} onChangeText={setName} />
        <Input label={t('client.phone')} placeholder="+54 11 2345-6789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <Input label={t('client.email')} placeholder={t('client.email')} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Input label={t('client.address')} placeholder={t('client.address')} value={address} onChangeText={setAddress} />

        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
          <Ionicons name="map-outline" size={18} color={colors.accent} />
          <Text style={[styles.mapText, { color: colors.accent }]}>
            {lat && lng ? t('client.selectOnMap') : t('client.selectOnMap')}
          </Text>
          {lat && lng && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
        </TouchableOpacity>

        <Input label={t('client.notes')} placeholder={t('client.notes')} multiline numberOfLines={3} value={notes} onChangeText={setNotes} />
        <Button title={t('common.save')} onPress={handleSave} loading={loading} style={{ marginTop: Spacing.md }} />
      </ScrollView>
    </ScreenWrapper>
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
