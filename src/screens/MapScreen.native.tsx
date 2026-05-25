import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useTheme } from '../hooks/useTheme';
import { api } from '../services/api';
import { Client } from '../types';

const { width } = Dimensions.get('window');

function deg2rad(deg: number) { return deg * (Math.PI / 180); }

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapScreen({ navigation }: any) {
  const { colors } = useTheme();
  const mapRef = useRef<MapView>(null);
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
      } catch {
        setLocationError(true);
      } finally {
        setLocationLoading(false);
      }
    })();
    api.getClients().then(setClients).catch(() => {});
  }, []);

  const recenter = async () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.lat, longitude: location.lng,
        latitudeDelta: 0.05, longitudeDelta: 0.05,
      }, 500);
    }
  };

  const clientsWithCoords = clients.filter((c) => c.lat && c.lng);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mapa de clientes</Text>
        <TouchableOpacity onPress={recenter}>
          <Ionicons name="locate-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {locationLoading ? (
        <View style={[styles.map, styles.loadingOverlay]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Obteniendo ubicación...</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location?.lat || -34.6037,
            longitude: location?.lng || -58.3816,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton
        >
          {clientsWithCoords.map((client) => (
            <Marker key={client.id} coordinate={{ latitude: client.lat!, longitude: client.lng! }}
              title={client.name}
              onCalloutPress={() => navigation.navigate('ClientDetail', { client })}
            >
              <View style={[styles.marker, { backgroundColor: colors.accent, borderColor: '#FFFFFF' }]}>
                <Ionicons name="business" size={16} color="#FFFFFF" />
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {locationError && (
        <View style={[styles.locationBanner, { backgroundColor: colors.warning + '20' }]}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
          <Text style={[styles.locationBannerText, { color: colors.warning }]}>Ubicación no disponible. Mostrando posición aproximada.</Text>
        </View>
      )}

      <View style={[styles.bottomSheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
        <Text style={[styles.sheetTitle, { color: colors.text }]}>
          Clientes {clientsWithCoords.length > 0 ? `(${clientsWithCoords.length})` : ''}
        </Text>
        {clientsWithCoords.length === 0 ? (
          <View style={styles.emptySheet}>
            <Ionicons name="map-outline" size={32} color={colors.textTertiary} />
            <Text style={[styles.emptySheetText, { color: colors.textTertiary }]}>Agregá clientes con dirección para verlos en el mapa</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  map: { flex: 1 },
  loadingOverlay: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, marginTop: Spacing.md },
  marker: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  locationBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.sm },
  locationBannerText: { fontSize: 12, flex: 1 },
  bottomSheet: { borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, padding: Spacing.xxl, paddingBottom: Spacing.massive, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg },
  sheetTitle: { fontSize: 17, fontWeight: '600', marginBottom: Spacing.lg },
  emptySheet: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptySheetText: { fontSize: 13, textAlign: 'center' },
  clientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  clientDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.md },
  clientName: { flex: 1, fontSize: 14, fontWeight: '500' },
  clientDistance: { fontSize: 12 },
});
