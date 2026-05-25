import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store';
import { authService } from './src/services/auth';
import { Loading, Toast } from './src/components';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toast = useAppStore((s) => s.toast);
  const hideToast = useAppStore((s) => s.hideToast);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    authService.restoreSession().finally(() => setReady(true));

    const notifSub = Notifications.addNotificationReceivedListener(() => {});
    const responseSub = Notifications.addNotificationResponseReceivedListener((r) => {
      const screen = r.notification.request.content.data?.screen as string | undefined;
      if (screen) Linking.openURL(Linking.createURL(screen));
    });
    return () => { notifSub.remove(); responseSub.remove(); };
  }, []);

  if (!ready) {
    return <Loading fullScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
          <Toast visible={toast.visible} message={toast.message} type={toast.type} onDismiss={hideToast} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
