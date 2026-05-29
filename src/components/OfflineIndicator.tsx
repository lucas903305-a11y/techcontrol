import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store';
import { t } from '../i18n';

export function OfflineIndicator() {
  const { colors } = useTheme();
  const locale = useAppStore((s) => s.locale);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOffline(!(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(300)}
      style={[styles.banner, { backgroundColor: colors.error }]}
    >
      <Text style={styles.text}>{t('common.offline', locale)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
