import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency, openWhatsApp } from '../utils';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function NewQuoteScreen({ navigation, route }: any) {
  const { colors, isDark } = useTheme();
  const [clientName, setClientName] = useState(route?.params?.client?.name || '');
  const [clientPhone, setClientPhone] = useState(route?.params?.client?.phone || '');
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: '', quantity: 1, unit_price: 0, total: 0 },
  ]);
  const [taxPercent, setTaxPercent] = useState(21);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, unit_price: 0, total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: field === 'description' ? value : Number(value) || 0 };
        updated.total = updated.quantity * updated.unit_price;
        return updated;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * (taxPercent / 100);
  const total = subtotal + tax;

  const generateQuoteNumber = () => {
    return `P-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  };

  const handleSendWhatsApp = () => {
    if (!clientPhone) {
      Alert.alert('Error', 'Ingresá el teléfono del cliente');
      return;
    }
    const summary = items
      .filter((i) => i.description)
      .map((i) => `• ${i.description}: ${i.quantity} x $${i.unit_price.toLocaleString('es-AR')} = $${i.total.toLocaleString('es-AR')}`)
      .join('\n');

    const message = `🧾 *TechControl - Presupuesto ${generateQuoteNumber()}*\n\nCliente: ${clientName}\n\n${summary}\n\n*Subtotal:* $${subtotal.toLocaleString('es-AR')}\n*IVA (${taxPercent}%):* $${tax.toLocaleString('es-AR')}\n*TOTAL: $${total.toLocaleString('es-AR')}*\n\n${notes ? `Notas: ${notes}` : ''}\n\nGenerado con TechControl`;

    openWhatsApp(clientPhone, message);
  };

  const handleCreatePDF = async () => {
    setLoading(true);
    try {
      const quoteNumber = generateQuoteNumber();
      const html = `
        <html>
        <head><meta charset="utf-8"><style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          h1 { color: #0EA5E9; font-size: 24px; }
          .header { border-bottom: 2px solid #0EA5E9; padding-bottom: 20px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #0A1628; color: white; padding: 12px; text-align: left; }
          td { padding: 12px; border-bottom: 1px solid #E2E8F0; }
          .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { margin-top: 40px; font-size: 12px; color: #94A3B8; text-align: center; }
        </style></head>
        <body>
          <div class="header">
            <h1>TechControl</h1>
            <p>Presupuesto: ${quoteNumber}</p>
            <p>Fecha: ${new Date().toLocaleDateString('es-AR')}</p>
          </div>
          <p><strong>Cliente:</strong> ${clientName}</p>
          <table>
            <tr><th>Descripción</th><th>Cant.</th><th>P. Unit.</th><th>Total</th></tr>
            ${items.filter(i => i.description).map(i => `
              <tr><td>${i.description}</td><td>${i.quantity}</td><td>$${i.unit_price.toLocaleString('es-AR')}</td><td>$${i.total.toLocaleString('es-AR')}</td></tr>
            `).join('')}
          </table>
          <div class="total">
            <p>Subtotal: $${subtotal.toLocaleString('es-AR')}</p>
            <p>IVA: $${tax.toLocaleString('es-AR')}</p>
            <p style="font-size:24px;">TOTAL: $${total.toLocaleString('es-AR')}</p>
          </div>
          ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
          <div class="footer"><p>Generado con TechControl - Gestión inteligente para técnicos IT</p></div>
        </body>
        </html>
      `;

      Alert.alert('PDF generado', `Presupuesto ${quoteNumber} creado exitosamente. Total: ${formatCurrency(total)}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Nuevo presupuesto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Cliente"
          placeholder="Nombre del cliente"
          value={clientName}
          onChangeText={setClientName}
        />
        <Input
          label="WhatsApp del cliente"
          placeholder="+54 11 2345-6789"
          keyboardType="phone-pad"
          value={clientPhone}
          onChangeText={setClientPhone}
        />

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Items del presupuesto</Text>

        {items.map((item, index) => (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemNumber, { color: colors.textSecondary }]}>Item #{index + 1}</Text>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.itemInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
              placeholder="Descripción del servicio/producto"
              placeholderTextColor={colors.textTertiary}
              value={item.description}
              onChangeText={(v) => updateItem(item.id, 'description', v)}
            />
            <View style={styles.itemRow}>
              <View style={styles.itemField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Cant.</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                  keyboardType="numeric"
                  value={String(item.quantity)}
                  onChangeText={(v) => updateItem(item.id, 'quantity', v)}
                />
              </View>
              <View style={styles.itemField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>P. Unit.</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                  keyboardType="numeric"
                  value={String(item.unit_price)}
                  onChangeText={(v) => updateItem(item.id, 'unit_price', v)}
                />
              </View>
              <View style={styles.itemField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Total</Text>
                <Text style={[styles.fieldTotal, { color: colors.text }]}>
                  ${item.total.toLocaleString('es-AR')}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={[styles.addItemBtn, { borderColor: colors.accent }]} onPress={addItem}>
          <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
          <Text style={[styles.addItemText, { color: colors.accent }]}>Agregar item</Text>
        </TouchableOpacity>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>IVA (%)</Text>
            <View style={styles.taxInput}>
              <TextInput
                style={[styles.taxField, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                keyboardType="numeric"
                value={String(taxPercent)}
                onChangeText={(v) => setTaxPercent(Number(v) || 0)}
              />
            </View>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
              {formatCurrency(tax)}
            </Text>
          </View>
          <View style={[styles.totalRow, { borderTopColor: colors.divider }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>TOTAL</Text>
            <Text style={[styles.totalValue, { color: colors.accent }]}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <Input
          label="Notas adicionales"
          placeholder="Condiciones, garantía, etc."
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />

        <Button title="Generar PDF" onPress={handleCreatePDF} loading={loading} style={{ marginBottom: Spacing.md }} />

        <Button
          title="Enviar por WhatsApp"
          variant="outline"
          onPress={handleSendWhatsApp}
          style={{ marginBottom: Spacing.huge }}
        />
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
  sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: Spacing.lg, marginTop: Spacing.md },
  itemCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  itemNumber: { fontSize: 12, fontWeight: '600' },
  itemInput: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  itemRow: { flexDirection: 'row', gap: Spacing.sm },
  itemField: { flex: 1 },
  fieldLabel: { fontSize: 11, fontWeight: '500', marginBottom: 4 },
  fieldInput: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    borderWidth: 1,
  },
  fieldTotal: { fontSize: 16, fontWeight: '700', paddingVertical: Spacing.sm },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: Spacing.xl,
  },
  addItemText: { fontSize: 14, fontWeight: '500' },
  summaryCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  taxInput: { width: 60 },
  taxField: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    fontSize: 14,
    borderWidth: 1,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    marginTop: Spacing.sm,
  },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 22, fontWeight: '800' },
});
