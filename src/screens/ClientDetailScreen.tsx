import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { openWhatsApp, openMaps, formatDate, formatPhone } from '../utils';
import { api } from '../services/api';
import { useAppStore } from '../store';
import { Client, Equipment, Visit } from '../types';

export default function ClientDetailScreen({ navigation, route }: any) {
  const { colors, isDark } = useTheme();
  const { t, locale } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const client: Client = route?.params?.client || {};
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [showAddEquip, setShowAddEquip] = useState(false);
  const [eqName, setEqName] = useState('');
  const [eqBrand, setEqBrand] = useState('');
  const [eqModel, setEqModel] = useState('');
  const [eqSerial, setEqSerial] = useState('');
  const [eqWarranty, setEqWarranty] = useState('');
  const [savingEquip, setSavingEquip] = useState(false);

  useFocusEffect(useCallback(() => {
    (async () => {
      try {
        const [eqData, visitsData] = await Promise.all([
          api.getEquipment(client.id),
          api.getVisits(),
        ]);
        setEquipment(eqData);
        setVisits(visitsData.filter((v: Visit) => v.client_id === client.id));
      } catch {} finally { setLoadingEquip(false); setLoadingVisits(false); }
    })();
  }, [client.id]));

  const handleAddEquipment = async () => {
    if (!eqName.trim()) { Alert.alert(t('common.error'), t('errors.required')); return; }
    setSavingEquip(true);
    try {
      const newEq = await api.createEquipment({
        client_id: client.id, name: eqName, brand: eqBrand, model: eqModel,
        serial_number: eqSerial, warranty_end: eqWarranty || undefined,
        installation_date: new Date().toISOString().split('T')[0],
      });
      setEquipment((prev) => [...prev, newEq]);
      setEqName(''); setEqBrand(''); setEqModel(''); setEqSerial(''); setEqWarranty('');
      setShowAddEquip(false);
      showToast(t('common.success'), 'success');
    } catch { showToast(t('common.error'), 'error'); }
    finally { setSavingEquip(false); }
  };

  const [activeVisit, setActiveVisit] = useState<{ id: string; start: Date } | null>(null);
  const [visitLoading, setVisitLoading] = useState(false);
  const [visitNotes, setVisitNotes] = useState('');
  const [elapsed, setElapsed] = useState('00:00');

  React.useEffect(() => {
    if (!activeVisit) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - activeVisit.start.getTime()) / 1000);
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      setElapsed(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVisit]);

  const handleCheckIn = async () => {
    setVisitLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert(t('common.error'), t('errors.required')); return; }
      const loc = await Location.getCurrentPositionAsync({});
      const visit = await api.checkIn({ client_id: client.id, user_id: client.user_id || '1', lat: loc.coords.latitude, lng: loc.coords.longitude, address: client.address || '' });
      setActiveVisit({ id: visit.id, start: new Date() });
      showToast(t('common.success'), 'success');
    } catch { showToast(t('common.error'), 'error'); }
    finally { setVisitLoading(false); }
  };

  const handleCheckOut = async () => {
    if (!activeVisit) return;
    setVisitLoading(true);
    try {
      await api.checkOut(activeVisit.id, visitNotes || undefined);
      setActiveVisit(null);
      setVisitNotes('');
      setElapsed('00:00');
      showToast(t('common.success'), 'success');
    } catch { showToast(t('common.error'), 'error'); }
    finally { setVisitLoading(false); }
  };

  const handleDeleteEquipment = (eq: Equipment) => {
    Alert.alert(t('common.delete'), t('common.delete') + ' ' + eq.name + '?', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: async () => {
        try { await api.deleteEquipment(eq.id); setEquipment((prev) => prev.filter((e) => e.id !== eq.id)); showToast(t('common.success'), 'success'); }
        catch { showToast(t('common.error'), 'error'); }
      }},
    ]);
  };

  const handleCall = () => {
    if (client.phone) {
      Linking.openURL(`tel:${formatPhone(client.phone)}`);
    }
  };

  const handleWhatsApp = () => {
    if (client.phone) {
      openWhatsApp(client.phone, `${t('client.whatsappHello')} ${client.name}, ${t('client.whatsappFrom')}`);
    } else {
      Alert.alert(t('common.error'), t('errors.required'));
    }
  };

  const handleOpenMaps = () => {
    if (client.lat && client.lng) {
      openMaps(client.lat, client.lng, client.name);
    } else if (client.address) {
      openMaps(-34.6037, -58.3816, client.address);
    }
  };

  const handleShare = () => {
    Share.share({
      message: `${t('client.shareHeader')}${client.name}\n${t('client.sharePhone')}${client.phone || 'N/A'}\n${t('client.shareAddress')}${client.address || 'N/A'}`,
    });
  };

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('client.detail')}</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <TouchableOpacity onPress={() => navigation.navigate('NewClient', { client })}>
            <Ionicons name="pencil-outline" size={22} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert(
            t('common.confirm'),
            t('client.deleteConfirm') + ' ' + client.name + '? ' + t('client.deleteUndoable'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: async () => {
                try {
                  await api.deleteClient(client.id);
                  navigation.goBack();
                } catch { Alert.alert(t('common.error'), t('common.error')); }
              }},
            ]
          )}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent + '20' }]}>
            <Text style={[styles.avatarText, { color: colors.accent }]}>
              {client.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.clientName, { color: colors.text }]}>{client.name}</Text>
          {client.email && <Text style={[styles.clientEmail, { color: colors.textSecondary }]}>{client.email}</Text>}

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.accent + '10' }]} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color={colors.accent} />
              <Text style={[styles.actionLabel, { color: colors.accent }]}>{t('client.call')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D36615' }]} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text style={{ fontSize: 11, fontWeight: '500', color: '#25D366' }}>{t('client.whatsapp')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.success + '15' }]} onPress={handleOpenMaps}>
              <Ionicons name="navigate-outline" size={20} color={colors.success} />
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.success }}>{t('client.navigate')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('client.detail')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('client.phone')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{client.phone || t('client.notRegistered')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('client.email')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{client.email || t('client.notRegistered')}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('client.address')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{client.address || t('client.notRegisteredAddress')}</Text>
          </View>
          {client.notes && (
            <View style={[styles.notesBox, { backgroundColor: colors.surfaceLight }]}>
              <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.notesText, { color: colors.textSecondary }]}>{client.notes}</Text>
            </View>
          )}
        </View>

        {activeVisit ? (
          <View style={[styles.visitBanner, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="time-outline" size={24} color={colors.success} />
              <View>
                <Text style={[styles.visitBannerTitle, { color: colors.success }]}>{t('client.visits')}</Text>
                <Text style={[styles.visitBannerTime, { color: colors.textSecondary }]}>{elapsed}</Text>
              </View>
            </View>
            <Input label={t('client.visitNotes')} placeholder={t('client.visitNotesPlaceholder')} multiline numberOfLines={2} value={visitNotes} onChangeText={setVisitNotes} containerStyle={{ marginTop: Spacing.md }} />
            <Button title={t('client.finishVisit')} variant="outline" onPress={handleCheckOut} loading={visitLoading} size="sm" style={{ marginTop: Spacing.sm }} />
          </View>
        ) : (
          <TouchableOpacity style={[styles.checkInBtn, { backgroundColor: colors.accent + '10', borderColor: colors.accent }]} onPress={handleCheckIn} disabled={visitLoading}>
            <Ionicons name="location-outline" size={20} color={colors.accent} />
            <Text style={[styles.checkInText, { color: colors.accent }]}>{visitLoading ? t('client.starting') : t('client.startVisit')}</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hardware-chip-outline" size={18} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('client.equipment')}</Text>
            <TouchableOpacity onPress={() => setShowAddEquip(!showAddEquip)}>
              <Ionicons name={showAddEquip ? 'close-circle' : 'add-circle'} size={22} color={colors.accent} />
            </TouchableOpacity>
          </View>

          {showAddEquip && (
            <View style={[styles.addEquipForm, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
              <Input label={t('client.equipName')} placeholder={t('client.equipNamePlaceholder')} value={eqName} onChangeText={setEqName} />
              <View style={styles.row}>
                <View style={{ flex: 1 }}><Input label={t('client.brand')} placeholder={t('client.brandPlaceholder')} value={eqBrand} onChangeText={setEqBrand} /></View>
                <View style={{ flex: 1 }}><Input label={t('client.model')} placeholder={t('client.modelPlaceholder')} value={eqModel} onChangeText={setEqModel} /></View>
              </View>
              <Input label={t('client.serialNumber')} placeholder={t('client.serialPlaceholder')} value={eqSerial} onChangeText={setEqSerial} />
              <Input label={t('client.warrantyUntil')} placeholder={t('client.warrantyPlaceholder')} value={eqWarranty} onChangeText={setEqWarranty} />
              <Button title={t('common.save')} onPress={handleAddEquipment} loading={savingEquip} size="sm" />
            </View>
          )}

          {loadingEquip ? (
            <ActivityIndicator size="small" color={colors.accent} style={{ paddingVertical: Spacing.xl }} />
          ) : equipment.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{t('common.empty')}</Text>
          ) : (
            equipment.map((eq, i) => (
              <View key={eq.id} style={[styles.equipmentItem, { borderBottomColor: colors.divider }]}>
                <View style={[styles.equipmentIcon, { backgroundColor: colors.accent + '15' }]}>
                  <Ionicons name="cube-outline" size={18} color={colors.accent} />
                </View>
                <View style={styles.equipmentInfo}>
                  <Text style={[styles.equipmentName, { color: colors.text }]}>{eq.name}</Text>
                  <Text style={[styles.equipmentDetail, { color: colors.textSecondary }]}>
                    {eq.brand && `${eq.brand} `}{eq.model && `${eq.model} `}{eq.serial_number && `• SN: ${eq.serial_number}`}
                  </Text>
                  {eq.warranty_end && (
                    <Text style={[styles.equipmentWarranty, { color: colors.warning }]}>
                      {t('client.warrantyPrefix')}{formatDate(eq.warranty_end)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => handleDeleteEquipment(eq)} style={{ padding: 4 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={18} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('client.visits')}</Text>
          </View>
          {loadingVisits ? (
            <ActivityIndicator size="small" color={colors.accent} style={{ paddingVertical: Spacing.xl }} />
          ) : visits.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{t('common.empty')}</Text>
          ) : visits.map((v) => (
            <View key={v.id} style={[styles.visitItem, { borderBottomColor: colors.divider }]}>
              <View style={[styles.visitDot, { backgroundColor: colors.accent }]} />
              <View style={styles.visitInfo}>
                <View style={styles.visitHeader}>
                  <Text style={[styles.visitDate, { color: colors.accent }]}>{formatDate(v.check_in, 'long')}</Text>
                  {v.check_out && (
                    <Text style={[styles.visitDuration, { color: colors.textTertiary }]}>
                      {Math.round((new Date(v.check_out).getTime() - new Date(v.check_in).getTime()) / 3600000)}h
                    </Text>
                  )}
                </View>
                {v.notes && <Text style={[styles.visitNotes, { color: colors.textSecondary }]}>{v.notes}</Text>}
              </View>
            </View>
          ))}
        </View>

        {(client.lat && client.lng) && (
          <TouchableOpacity style={[styles.mapPreview, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleOpenMaps}>
            <Ionicons name="map-outline" size={20} color={colors.accent} />
            <Text style={[styles.mapText, { color: colors.accent }]}>{t('client.navigate')}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenWrapper>
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
  content: { padding: Spacing.xxl, paddingBottom: Spacing.massive },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: { fontSize: 28, fontWeight: '700' },
  clientName: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  clientEmail: { fontSize: 13, marginBottom: Spacing.lg },
  actionRow: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  actionLabel: { fontSize: 11, fontWeight: '500' },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  infoLabel: { fontSize: 13, width: 80 },
  infoValue: { fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'right' },
  notesBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  notesText: { fontSize: 12, flex: 1 },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: Spacing.xl },
  checkInBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderStyle: 'dashed', marginBottom: Spacing.md },
  checkInText: { fontSize: 15, fontWeight: '600' },
  visitBanner: { padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.md },
  visitBannerTitle: { fontSize: 15, fontWeight: '600' },
  visitBannerTime: { fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums'] },
  addEquipForm: { padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, marginBottom: Spacing.md },
  row: { flexDirection: 'row', gap: Spacing.md },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  equipmentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  equipmentInfo: { flex: 1 },
  equipmentName: { fontSize: 14, fontWeight: '600' },
  equipmentDetail: { fontSize: 12, marginTop: 1 },
  equipmentWarranty: { fontSize: 11, marginTop: 2 },
  visitItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  visitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: Spacing.md,
  },
  visitInfo: { flex: 1 },
  visitHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  visitDate: { fontSize: 13, fontWeight: '600' },
  visitDuration: { fontSize: 11 },
  visitNotes: { fontSize: 12, marginTop: 2 },
  mapPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  mapText: { flex: 1, fontSize: 14, fontWeight: '500' },
});
