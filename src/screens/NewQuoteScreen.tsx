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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store';
import { formatCurrency, openWhatsApp } from '../utils';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function NewQuoteScreen({ navigation, route }: any) {
  const { colors, isDark } = useTheme();
  const { t, locale } = useTranslation();
  const [clientName, setClientName] = useState(route?.params?.client?.name || '');
  const [clientPhone, setClientPhone] = useState(route?.params?.client?.phone || '');
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: '', quantity: 1, unit_price: 0, total: 0 },
  ]);
  const [taxPercent, setTaxPercent] = useState(21);
  const [notes, setNotes] = useState('');
  const showToast = useAppStore((s) => s.showToast);
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
      Alert.alert(t('common.error'), t('quote.phoneRequired'));
      return;
    }
    const summary = items
      .filter((i) => i.description)
      .map((i) => `• ${i.description}: ${i.quantity} x $${i.unit_price.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')} = $${i.total.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}`)
      .join('\n');

    const message = `🧾 *TechControl - ${t('quote.quoteNumber')} ${generateQuoteNumber()}*\n\n${t('quote.client')}: ${clientName}\n\n${summary}\n\n*${t('quote.subtotal')}:* $${subtotal.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}\n*${t('quote.tax')} (${taxPercent}%):* $${tax.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}\n*${t('quote.total')}: $${total.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}*\n\n${notes ? `${t('quote.notes')}: ${notes}` : ''}\n\n${t('quote.generatedBy')}`;

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
            <p>${t('quote.quoteNumber')}: ${quoteNumber}</p>
            <p>${t('quote.dateLabel')}: ${new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR')}</p>
          </div>
          <p><strong>${t('quote.client')}:</strong> ${clientName}</p>
          <table>
            <tr><th>${t('quote.description')}</th><th>${t('quote.qty')}</th><th>${t('quote.unitPrice')}</th><th>${t('quote.itemTotal')}</th></tr>
            ${items.filter(i => i.description).map(i => `
              <tr><td>${i.description}</td><td>${i.quantity}</td><td>$${i.unit_price.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}</td><td>$${i.total.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}</td></tr>
            `).join('')}
          </table>
          <div class="total">
            <p>${t('quote.subtotal')}: $${subtotal.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}</p>
            <p>${t('quote.tax')}: $${tax.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}</p>
            <p style="font-size:24px;">${t('quote.total')}: $${total.toLocaleString(locale === 'en' ? 'en-US' : 'es-AR')}</p>
          </div>
          ${notes ? `<p><strong>${t('quote.notes')}:</strong> ${notes}</p>` : ''}
          <div class="footer"><p>${t('quote.generatedBy')}</p></div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `${t('quote.quoteNumber')} ${quoteNumber}` });
      } else {
        showToast(t('quote.pdfGenerated'), 'success');
      }
    } catch (error) {
      showToast(t('quote.pdfError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('quote.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label={t('quote.client')}
          placeholder={t('quote.clientPlaceholder')}
          value={clientName}
          onChangeText={setClientName}
        />
        <Input
          label={t('quote.clientWhatsapp')}
          placeholder={t('quote.phonePlaceholder')}
          keyboardType="phone-pad"
          value={clientPhone}
          onChangeText={setClientPhone}
        />

        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('quote.items')}</Text>

        {items.map((item, index) => (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemNumber, { color: colors.textSecondary }]}>{t('quote.itemNumber')} #{index + 1}</Text>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.itemInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
              placeholder={t('quote.descriptionPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              value={item.description}
              onChangeText={(v) => updateItem(item.id, 'description', v)}
            />
            <View style={styles.itemRow}>
              <View style={styles.itemField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('quote.qty')}</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                  keyboardType="numeric"
                  value={String(item.quantity)}
                  onChangeText={(v) => updateItem(item.id, 'quantity', v)}
                />
              </View>
              <View style={styles.itemField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('quote.unitPrice')}</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }]}
                  keyboardType="numeric"
                  value={String(item.unit_price)}
                  onChangeText={(v) => updateItem(item.id, 'unit_price', v)}
                />
              </View>
              <View style={styles.itemField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t('quote.itemTotal')}</Text>
                <Text style={[styles.fieldTotal, { color: colors.text }]}>
                  ${item.total.toLocaleString('es-AR')}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={[styles.addItemBtn, { borderColor: colors.accent }]} onPress={addItem}>
          <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
          <Text style={[styles.addItemText, { color: colors.accent }]}>{t('quote.addItem')}</Text>
        </TouchableOpacity>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('quote.subtotal')}</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('quote.tax')} (%)</Text>
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
            <Text style={[styles.totalLabel, { color: colors.text }]}>{t('quote.total')}</Text>
            <Text style={[styles.totalValue, { color: colors.accent }]}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <Input
          label={t('quote.notes')}
          placeholder={t('quote.notesPlaceholder')}
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />

        <Button title={t('quote.generatePdf')} onPress={handleCreatePDF} loading={loading} style={{ marginBottom: Spacing.md }} />

        <Button
          title={t('quote.sendWhatsapp')}
          variant="outline"
          onPress={handleSendWhatsApp}
          style={{ marginBottom: Spacing.huge }}
        />
      </ScrollView>
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
