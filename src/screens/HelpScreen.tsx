import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';

export default function HelpScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const faqs = [
    { q: t('help.faq1_q'), a: t('help.faq1_a') },
    { q: t('help.faq2_q'), a: t('help.faq2_a') },
    { q: t('help.faq3_q'), a: t('help.faq3_a') },
    { q: t('help.faq4_q'), a: t('help.faq4_a') },
  ];

  const contacts = [
    { icon: 'logo-whatsapp', label: t('help.whatsappSupport'), value: '+54 11 2345-6789', color: '#25D366' },
    { icon: 'mail-outline', label: t('help.email'), value: 'soporte@techcontrol.app', color: colors.accent },
    { icon: 'globe-outline', label: t('help.website'), value: 'techcontrol.app', color: colors.accent },
  ];

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.help')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('help.faq')}</Text>
          {faqs.map((faq, i) => (
            <View key={i} style={[styles.faqItem, i < faqs.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.q}</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.a}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('help.contact')}</Text>
          {contacts.map((c, i) => (
            <TouchableOpacity key={i} style={[styles.contactRow, i < contacts.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <Ionicons name={c.icon as any} size={20} color={c.color} />
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>{c.label}</Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>{c.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  card: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: Spacing.lg },
  faqItem: { paddingVertical: Spacing.md },
  faqQuestion: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  faqAnswer: { fontSize: 13, lineHeight: 18 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 12 },
  contactValue: { fontSize: 14, fontWeight: '500' },
});
