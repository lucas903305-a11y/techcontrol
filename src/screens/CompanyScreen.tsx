import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store';
import { api } from '../services/api';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function CompanyScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [cuit, setCuit] = useState('30-12345678-9');
  const [address, setAddress] = useState('Av. Corrientes 1234');

  const handleSave = async () => {
    setUser({ ...user, company_name: companyName } as any);
    await api.updateProfile({ company_name: companyName }).catch(() => {});
    showToast(t('company.updated'), 'success');
    navigation.goBack();
  };

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.myCompany')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label={t('company.name')} placeholder={t('company.namePlaceholder')} value={companyName} onChangeText={setCompanyName} />
        <Input label={t('company.cuit')} placeholder="30-12345678-9" value={cuit} onChangeText={setCuit} />
        <Input label={t('company.taxAddress')} placeholder={t('company.addressPlaceholder')} value={address} onChangeText={setAddress} />
        <Button title={t('common.save')} onPress={handleSave} style={{ marginTop: Spacing.xl }} />
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
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
});
