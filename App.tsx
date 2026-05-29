import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store';
import { authService } from './src/services/auth';
import { registerForPushNotificationsAsync, setupNotificationListeners } from './src/services/notifications';
import { Loading, Toast } from './src/components';
import { OfflineIndicator } from './src/components/OfflineIndicator';
import { useTranslation } from './src/hooks/useTranslation';

const linking = {
  prefixes: ['techcontrol://', 'https://techcontrol.app'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      ResetPassword: 'reset-password',
      Main: '',
    },
  },
};

export default function App() {
  const { t } = useTranslation();
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toast = useAppStore((s) => s.toast);
  const hideToast = useAppStore((s) => s.hideToast);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authService.restoreSession().finally(() => setReady(true));
    registerForPushNotificationsAsync();
    const cleanup = setupNotificationListeners(
      () => {},
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.screen) {
          // navigation handled by deep linking
        }
      },
    );
    return cleanup;
  }, []);

  if (!ready) {
    return <Loading fullScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <OfflineIndicator />
          <AppNavigator />
          <Toast visible={toast.visible} message={toast.message} type={toast.type} onDismiss={hideToast} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
