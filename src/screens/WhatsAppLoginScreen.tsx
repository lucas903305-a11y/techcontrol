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
import { useTheme } from '../hooks/useTheme';

export default function WhatsAppLoginScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  const handleSendCode = async () => {
    if (!phone) { Alert.alert('Error', 'Ingresá tu número de WhatsApp'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('code'); Alert.alert('Código enviado', 'Simulación: código 123456'); }, 1500);
  };

  const handleVerifyCode = async () => {
    if (!code) { Alert.alert('Error', 'Ingresá el código de verificación'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1500);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="logo-whatsapp" size={48} color="#25D366" />
          <Text style={[styles.title, { color: colors.text }]}>WhatsApp</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {step === 'phone' ? 'Ingresá tu número de WhatsApp con código de país' : 'Ingresá el código que enviamos a tu WhatsApp'}
        </Text>

        {step === 'phone' ? (
          <>
            <Input label="Número de WhatsApp" placeholder="+54 11 2345-6789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            <Button title="Enviar código" onPress={handleSendCode} loading={loading} />
          </>
        ) : (
          <>
            <Input label="Código de verificación" placeholder="123456" keyboardType="number-pad" value={code} onChangeText={setCode} />
            <Button title="Verificar" onPress={handleVerifyCode} loading={loading} />
            <Button title="Volver" variant="ghost" onPress={() => setStep('phone')} style={{ marginTop: Spacing.md }} />
          </>
        )}

        <Button title="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.xxl }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontSize: 28, fontWeight: '700', marginTop: Spacing.md },
  subtitle: { fontSize: 14, marginBottom: Spacing.xxl, textAlign: 'center' },
});
