import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { Input, Button } from '../components';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/auth';

export default function RegisterScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert(t('common.error'), t('errors.required'));
      return;
    }
    setLoading(true);
    try {
      await authService.signUp(email, password, name);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('errors.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.logoSmall, { backgroundColor: colors.accent }]}>
            <Ionicons name="hardware-chip-outline" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Tech<Text style={{ color: colors.accent }}>Control</Text>
          </Text>
        </View>

        <Text style={[styles.welcome, { color: colors.text }]}>{t('auth.createAccount')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('auth.createAccountSubtitle')}
        </Text>

        <View style={styles.form}>
          <Input label={t('auth.name')} placeholder="Juan Pérez" value={name} onChangeText={setName} />
          <Input label={t('auth.email')} placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <Input label={t('auth.phone')} placeholder="+54 11 2345-6789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <Input label={t('auth.password')} placeholder={t('auth.passwordHint')} secureTextEntry value={password} onChangeText={setPassword} />
          <Button title={t('auth.register')} onPress={handleRegister} loading={loading} style={styles.registerButton} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>{t('auth.hasAccount')} </Text>
          <Button title={t('auth.login')} variant="ghost" size="sm" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xxl },
  logoSmall: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  welcome: { fontSize: 26, fontWeight: '700', marginBottom: Spacing.sm },
  subtitle: { fontSize: 14, marginBottom: Spacing.xxl },
  form: { width: '100%' },
  registerButton: { marginTop: Spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.xxl },
  footerText: { fontSize: 14 },
});
