import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { Input, Button } from '../components';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store';
import { authService } from '../services/auth';

export default function ResetPasswordScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) { Alert.alert(t('common.error'), t('auth.enterEmail')); return; }
    setLoading(true);
    try {
      await authService.resetPassword(email);
      showToast(t('auth.emailSent'), 'success');
      navigation.goBack();
    } catch { showToast(t('auth.emailSendFailed'), 'error'); }
    finally { setLoading(false); }
  };

  return (
    <ScreenWrapper>
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>{t('auth.resetPassword')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('auth.resetPasswordSubtitle')}</Text>
        </View>
        <Input label={t('auth.email')} placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Button title={t('auth.sendLink')} onPress={handleReset} loading={loading} />
        <Button title={t('common.back')} variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.md }} />
      </View>
    </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontSize: 24, fontWeight: '700', marginTop: Spacing.md },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: Spacing.sm },
});
