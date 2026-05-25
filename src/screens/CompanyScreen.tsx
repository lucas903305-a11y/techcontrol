import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';

export default function CompanyScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [companyName, setCompanyName] = useState('Tech Solutions');
  const [cuit, setCuit] = useState('30-12345678-9');
  const [address, setAddress] = useState('Av. Corrientes 1234');

  const handleSave = () => {
    Alert.alert('Guardado', 'Datos de empresa actualizados');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mi empresa</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input label="Nombre de empresa" placeholder="Nombre" value={companyName} onChangeText={setCompanyName} />
        <Input label="CUIT/CUIL" placeholder="30-12345678-9" value={cuit} onChangeText={setCuit} />
        <Input label="Dirección fiscal" placeholder="Dirección" value={address} onChangeText={setAddress} />
        <Button title="Guardar" onPress={handleSave} style={{ marginTop: Spacing.xl }} />
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
});
