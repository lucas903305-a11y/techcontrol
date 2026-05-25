import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';

export default function BillingScreen({ navigation }: any) {
  const { colors } = useTheme();

  const plans = [
    { name: 'Free', price: '$0', desc: 'Hasta 10 clientes', current: false },
    { name: 'Pro', price: '$9.99/mes', desc: 'Clientes ilimitados + IA', current: true, popular: true },
    { name: 'Enterprise', price: '$29.99/mes', desc: 'Todo + equipo multi-técnico', current: false },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Plan y facturación</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.currentLabel, { color: colors.textSecondary }]}>Plan actual</Text>
        <View style={[styles.currentCard, { backgroundColor: colors.accent + '15', borderColor: colors.accent }]}>
          <View style={styles.currentRow}>
            <Text style={[styles.currentName, { color: colors.accent }]}>Pro</Text>
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={styles.badgeText}>ACTIVO</Text>
            </View>
          </View>
          <Text style={[styles.currentPrice, { color: colors.text }]}>$9.99/mes</Text>
          <Text style={[styles.currentDesc, { color: colors.textSecondary }]}>Clientes ilimitados, IA, reportes avanzados</Text>
        </View>

        <Text style={[styles.plansLabel, { color: colors.text }]}>Cambiar plan</Text>
        {plans.map((plan, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.planCard, { backgroundColor: colors.surface, borderColor: plan.popular ? colors.accent : colors.border }]}
          >
            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                <Text style={[styles.planDesc, { color: colors.textSecondary }]}>{plan.desc}</Text>
              </View>
              <Text style={[styles.planPrice, { color: colors.text }]}>{plan.price}</Text>
            </View>
            {plan.popular && (
              <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.popularText}>RECOMENDADO</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.massive },
  currentLabel: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  currentCard: { borderRadius: BorderRadius.lg, borderWidth: 1.5, padding: Spacing.xl, marginBottom: Spacing.xxl },
  currentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  currentName: { fontSize: 20, fontWeight: '700' },
  badge: { paddingHorizontal: Spacing.md, paddingVertical: 2, borderRadius: BorderRadius.round },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#FFF', letterSpacing: 1 },
  currentPrice: { fontSize: 28, fontWeight: '800', marginBottom: Spacing.xs },
  currentDesc: { fontSize: 13 },
  plansLabel: { fontSize: 17, fontWeight: '600', marginBottom: Spacing.lg },
  planCard: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.xl, marginBottom: Spacing.md },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { fontSize: 17, fontWeight: '700' },
  planDesc: { fontSize: 12, marginTop: 2 },
  planPrice: { fontSize: 18, fontWeight: '700' },
  popularBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: 2, borderRadius: BorderRadius.round, marginTop: Spacing.md },
  popularText: { fontSize: 10, fontWeight: '700', color: '#FFF', letterSpacing: 1 },
});
