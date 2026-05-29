import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function PlaceholderScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const screenName = route?.params?.title || t('placeholder.title');

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{screenName}</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.title, { color: colors.text }]}>{t('placeholder.comingSoon')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('placeholder.description')}</Text>
      </View>
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
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 14 },
});
