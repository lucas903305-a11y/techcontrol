import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store';

export default function EditProfileScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [company, setCompany] = useState(user?.company_name || '');
  const [photoUri, setPhotoUri] = useState<string | null>(user?.photo_url || null);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    setUser({ ...user, name, phone, company_name: company, photo_url: photoUri } as any);
    Alert.alert('Guardado', 'Perfil actualizado correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Editar perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handlePickPhoto} style={[styles.photoContainer, { borderColor: colors.border }]}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={[styles.photoPlaceholder, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="person" size={40} color={colors.accent} />
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: colors.accent }]}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.photoHint, { color: colors.textSecondary }]}>Tocá para cambiar foto</Text>
        </View>

        <Input label="Nombre completo" placeholder="Tu nombre" value={name} onChangeText={setName} />
        <Input label="Teléfono" placeholder="+54 11 2345-6789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <Input label="Empresa" placeholder="Nombre de tu empresa" value={company} onChangeText={setCompany} />

        <Button title="Guardar cambios" onPress={handleSave} style={{ marginTop: Spacing.xl }} />
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
  photoSection: { alignItems: 'center', paddingVertical: Spacing.xxl },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    marginBottom: Spacing.md,
  },
  photo: { width: 96, height: 96, borderRadius: 48 },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  photoHint: { fontSize: 12 },
});
