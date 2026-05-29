import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { Input, Button } from '../components';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export default function WhatsAppLoginScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  const handleSendCode = async () => {
    if (!phone) { Alert.alert(t('common.error'), t('auth.enterWhatsAppNumber')); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('code'); Alert.alert(t('auth.codeSent'), t('auth.simulationCode')); }, 1500);
  };

  const handleVerifyCode = async () => {
    if (!code) { Alert.alert(t('common.error'), t('auth.enterVerificationCode')); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1500);
  };

  return (
    <ScreenWrapper>
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="logo-whatsapp" size={48} color="#25D366" />
          <Text style={[styles.title, { color: colors.text }]}>{t('auth.whatsappLogin')}</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {step === 'phone' ? t('auth.enterWhatsAppWithCode') : t('auth.enterSentCode')}
        </Text>

        {step === 'phone' ? (
          <>
            <Input label={t('auth.phone')} placeholder="+54 11 2345-6789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            <Button title={t('auth.sendCode')} onPress={handleSendCode} loading={loading} />
          </>
        ) : (
          <>
            <Input label={t('auth.verificationCode')} placeholder="123456" keyboardType="number-pad" value={code} onChangeText={setCode} />
            <Button title={t('auth.verify')} onPress={handleVerifyCode} loading={loading} />
            <Button title={t('common.back')} variant="ghost" onPress={() => setStep('phone')} style={{ marginTop: Spacing.md }} />
          </>
        )}

        <Button title={t('common.cancel')} variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.xxl }} />
      </View>
    </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontSize: 28, fontWeight: '700', marginTop: Spacing.md },
  subtitle: { fontSize: 14, marginBottom: Spacing.xxl, textAlign: 'center' },
});
