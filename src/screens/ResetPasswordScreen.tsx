import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';

export default function ResetPasswordScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) { Alert.alert('Error', 'Ingresá tu email'); return; }
    setLoading(true);
    try {
      Alert.alert('Email enviado', 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.');
      navigation.goBack();
    } catch { Alert.alert('Error', 'No se pudo enviar el email'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>Restablecer contraseña</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Te enviaremos un link al email registrado</Text>
        </View>
        <Input label="Email" placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Button title="Enviar link" onPress={handleReset} loading={loading} />
        <Button title="Volver" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.md }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontSize: 24, fontWeight: '700', marginTop: Spacing.md },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: Spacing.sm },
});
