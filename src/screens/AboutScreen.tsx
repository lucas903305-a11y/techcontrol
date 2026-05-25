import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

export default function AboutScreen({ navigation }: any) {
  const { colors } = useTheme();

  const features = [
    'Gestión de clientes y equipos',
    'Sistema de tickets inteligente',
    'Presupuestos con PDF',
    'Mapa de clientes y rutas',
    'Integración WhatsApp',
    'Asistente IA para diagnósticos',
    'Control de inventario',
    'Reportes y estadísticas',
    'Modo oscuro',
    'Multi-técnico',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Acerca de</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={[styles.logo, { backgroundColor: colors.accent }]}>
            <Ionicons name="hardware-chip-outline" size={36} color="#FFFFFF" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>TechControl</Text>
          <Text style={[styles.version, { color: colors.textSecondary }]}>Versión 1.0.0</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            TechControl es la plataforma de gestión inteligente para técnicos IT, instaladores y empresas de soporte en Latinoamérica. Diseñada para simplificar la administración de clientes, tickets, presupuestos y trabajos desde tu celular.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Funcionalidades</Text>
          {features.map((f, i) => (
            <View key={i} style={[styles.featureRow, i < features.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tecnologías</Text>
          <View style={styles.techRow}>
            {['React Native', 'Expo', 'Supabase', 'OpenAI'].map((tech, i) => (
              <View key={i} style={[styles.techBadge, { backgroundColor: colors.accent + '15' }]}>
                <Text style={[styles.techText, { color: colors.accent }]}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          © 2025 TechControl. Todos los derechos reservados.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  logoSection: { alignItems: 'center', paddingVertical: Spacing.xxl },
  logo: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  appName: { fontSize: 24, fontWeight: '800' },
  version: { fontSize: 14, marginTop: 2 },
  card: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md },
  description: { fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  featureText: { fontSize: 14, flex: 1 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  techBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.round },
  techText: { fontSize: 12, fontWeight: '600' },
  footer: { fontSize: 12, textAlign: 'center', marginTop: Spacing.lg },
});
