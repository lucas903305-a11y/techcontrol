import { Linking, Platform } from 'react-native';

export function openWhatsApp(phone: string, message?: string) {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  const url = Platform.OS === 'ios'
    ? `https://wa.me/${cleanPhone}${text}`
    : `whatsapp://send?phone=${cleanPhone}${text}`;

  Linking.openURL(url).catch(() => {
    Linking.openURL(`https://wa.me/${cleanPhone}${text}`);
  });
}

export function openMaps(lat: number, lng: number, label?: string) {
  const url = Platform.select({
    ios: `maps://app?daddr=${lat},${lng}&q=${encodeURIComponent(label || '')}`,
    android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label || '')})`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  });
  Linking.openURL(url!);
}

export function openEmail(email: string, subject?: string) {
  const s = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  Linking.openURL(`mailto:${email}${s}`);
}
