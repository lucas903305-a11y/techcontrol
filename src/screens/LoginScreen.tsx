import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/auth';

export default function LoginScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('errors.required'));
      return;
    }
    setLoading(true);
    try {
      await authService.signIn(email, password);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('errors.genericError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.signInWithGoogle();
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
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
            <Ionicons name="hardware-chip-outline" size={28} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Tech<Text style={{ color: colors.accent }}>Control</Text>
          </Text>
        </View>

        <Text style={[styles.welcome, { color: colors.text }]}>{t('auth.welcome')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('auth.welcomeSubtitle')}
        </Text>

        <View style={styles.form}>
          <Input
            label={t('auth.email')}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <Input
              label={t('auth.password')}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={[styles.forgotText, { color: colors.accent }]}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textTertiary }]}>{t('auth.orContinueWith')}</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleGoogleLogin}
            >
              <Ionicons name="logo-google" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('WhatsAppLogin')}
            >
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>{t('auth.noAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: colors.accent }]}>{t('auth.createAccount')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xxxl },
  logoSmall: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  welcome: { fontSize: 28, fontWeight: '700', marginBottom: Spacing.sm },
  subtitle: { fontSize: 14, marginBottom: Spacing.xxl },
  form: { width: '100%' },
  passwordContainer: { position: 'relative' },
  eyeButton: { position: 'absolute', right: 14, top: 42, padding: 4 },
  forgotPassword: { alignSelf: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.xl },
  forgotText: { fontSize: 13, fontWeight: '500' },
  loginButton: { marginBottom: Spacing.xxl },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xxl },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: Spacing.lg, fontSize: 12 },
  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg },
  socialButton: { width: 52, height: 52, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xxl },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '600' },
});
