import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

export default function HelpScreen({ navigation }: any) {
  const { colors } = useTheme();

  const faqs = [
    { q: '¿Cómo creo un ticket?', a: 'Andá a Tickets > Nueva ticket. Completá título, descripción y prioridad.' },
    { q: '¿Cómo agrego un cliente?', a: 'Andá a Clientes > +. Ingresá nombre, teléfono y dirección.' },
    { q: '¿Cómo genero un presupuesto?', a: 'Desde el Dashboard tocá "Presupuesto" o andá a la sección correspondiente.' },
    { q: '¿Cómo comparto por WhatsApp?', a: 'Usá el botón de WhatsApp en cada cliente o presupuesto.' },
  ];

  const contacts = [
    { icon: 'logo-whatsapp', label: 'Soporte por WhatsApp', value: '+54 11 2345-6789', color: '#25D366' },
    { icon: 'mail-outline', label: 'Email', value: 'soporte@techcontrol.app', color: colors.accent },
    { icon: 'globe-outline', label: 'Web', value: 'techcontrol.app', color: colors.accent },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ayuda y soporte</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preguntas frecuentes</Text>
          {faqs.map((faq, i) => (
            <View key={i} style={[styles.faqItem, i < faqs.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.q}</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.a}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contacto</Text>
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
    </View>
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
