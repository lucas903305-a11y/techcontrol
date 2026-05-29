import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export default function MapPickerScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const initialLat = route?.params?.lat || -34.6037;
  const initialLng = route?.params?.lng || -58.3816;

  const [region, setRegion] = useState<Region>({
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState({ latitude: initialLat, longitude: initialLng });
  const [address, setAddress] = useState('');
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    reverseGeocode(initialLat, initialLng);
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    setResolving(true);
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const r = results[0];
        const parts = [r.street, r.streetNumber, r.city, r.region].filter(Boolean);
        setAddress(parts.join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } else {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally { setResolving(false); }
  };

  const handleMarkerDrag = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const handleMapLongPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion((prev) => ({ ...prev, latitude, longitude }));
    reverseGeocode(latitude, longitude);
  };

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setMarker({ latitude, longitude });
      setRegion((prev) => ({ ...prev, latitude, longitude }));
      reverseGeocode(latitude, longitude);
    } catch {} finally { setLocating(false); }
  };

  const handleConfirm = () => {
    navigation.navigate('NewClient', {
      pickedLat: marker.latitude,
      pickedLng: marker.longitude,
      pickedAddress: address,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('mapPicker.title')}</Text>
        <TouchableOpacity onPress={handleLocateMe} disabled={locating}>
          <Ionicons name={locating ? 'locate' : 'locate-outline'} size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onLongPress={handleMapLongPress}
        showsUserLocation
      >
        <Marker
          coordinate={marker}
          draggable
          onDragEnd={handleMarkerDrag}
        />
      </MapView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={18} color={colors.accent} />
          {resolving ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Text style={[styles.addressText, { color: colors.text }]} numberOfLines={2}>
              {address || t('mapPicker.tapToPlacePin')}
            </Text>
          )}
        </View>
        <Text style={[styles.hint, { color: colors.textTertiary }]}>
          {t('mapPicker.longPressHint')}
        </Text>
        <Button title={t('mapPicker.confirmLocation')} onPress={handleConfirm} disabled={!address} />
      </View>
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
  map: { flex: 1 },
  bottomBar: {
    borderTopWidth: 1,
    padding: Spacing.xxl,
    paddingBottom: Spacing.massive,
    gap: Spacing.sm,
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 24 },
  addressText: { fontSize: 14, fontWeight: '500', flex: 1 },
  hint: { fontSize: 12, textAlign: 'center' },
});
