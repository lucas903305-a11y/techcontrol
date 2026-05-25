import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { Client } from '../types';

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        } else {
          setLocationError(true);
        }
      } catch { setLocationError(true); }
      finally { setLocationLoading(false); }
    })();
    api.getClients().then(setClients).catch(() => {});
  }, []);

  const clientsWithCoords = clients.filter((c) => c.lat && c.lng);
  const center = location || { lat: -34.6037, lng: -58.3816 };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mapa de clientes</Text>
        <View style={{ width: 24 }} />
      </View>

      {locationLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Obteniendo ubicación...</Text>
        </View>
      ) : (
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${center.lng},${center.lat}&zoom=13${clientsWithCoords.map((c) => `&marker=lonlat:${c.lng},${c.lat};color:%230EA5E9;size:medium;icon:building`).join('')}&apiKey=demo`,
          }}
          style={styles.mapImage}
          resizeMode="cover"
        />
      )}

      {locationError && (
        <View style={[styles.locationBanner, { backgroundColor: colors.warning + '20' }]}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
          <Text style={[styles.locationBannerText, { color: colors.warning }]}>Ubicación no disponible</Text>
        </View>
      )}

      <View style={[styles.bottomSheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
        <Text style={[styles.sheetTitle, { color: colors.text }]}>Clientes {clientsWithCoords.length > 0 ? `(${clientsWithCoords.length})` : ''}</Text>
        <ScrollView style={{ maxHeight: 200 }}>
          {clientsWithCoords.length === 0 ? (
            <View style={styles.emptySheet}>
              <Ionicons name="map-outline" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptySheetText, { color: colors.textTertiary }]}>Agregá clientes con dirección</Text>
            </View>
          ) : (
            clientsWithCoords.map((client, i) => {
              const dist = location && client.lat && client.lng
                ? getDistance(location.lat, location.lng, client.lat, client.lng)
                : null;
              return (
                <TouchableOpacity key={client.id}
                  style={[styles.clientRow, i < clientsWithCoords.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}
                  onPress={() => navigation.navigate('ClientDetail', { client })}
                >
                  <View style={[styles.clientDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.clientName, { color: colors.text }]}>{client.name}</Text>
                  {dist !== null && (
                    <Text style={[styles.clientDistance, { color: colors.textSecondary }]}>
                      {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                    </Text>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  mapImage: { flex: 1, width: '100%' },
  loadingOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, marginTop: Spacing.md },
  locationBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.sm },
  locationBannerText: { fontSize: 12, flex: 1 },
  bottomSheet: { borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, padding: Spacing.xxl, paddingBottom: Spacing.massive },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg },
  sheetTitle: { fontSize: 17, fontWeight: '600', marginBottom: Spacing.lg },
  emptySheet: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptySheetText: { fontSize: 13, textAlign: 'center' },
  clientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  clientDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.md },
  clientName: { flex: 1, fontSize: 14, fontWeight: '500' },
  clientDistance: { fontSize: 12 },
});
