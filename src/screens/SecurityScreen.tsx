import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';

export default function SecurityScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }
    Alert.alert('Contraseña actualizada', 'Tu contraseña se cambió correctamente');
    setCurrentPassword('');
    setNewPassword('');
  };

  const securityItems = [
    { icon: 'finger-print-outline', label: 'Biométrico', desc: 'Huella dactilar / Face ID' },
    { icon: 'lock-closed-outline', label: 'PIN de acceso', desc: 'Proteger app con PIN' },
    { icon: 'key-outline', label: '2FA', desc: 'Autenticación de dos factores' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Seguridad</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Cambiar contraseña</Text>
          <Input label="Contraseña actual" placeholder="••••••••" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
          <Input label="Nueva contraseña" placeholder="Mínimo 8 caracteres" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
          <Button title="Actualizar contraseña" onPress={handleChangePassword} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: Spacing.xl }]}>Opciones de seguridad</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {securityItems.map((item, i) => (
            <View key={i} style={[styles.row, i < securityItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <Ionicons name={item.icon as any} size={20} color={colors.text} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          ))}
        </View>
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
  card: { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.lg, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, gap: Spacing.md },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 15 },
  rowDesc: { fontSize: 12, marginTop: 1 },
});
