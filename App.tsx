import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store';
import { authService } from './src/services/auth';
import { Loading, Toast } from './src/components';

export default function App() {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toast = useAppStore((s) => s.toast);
  const hideToast = useAppStore((s) => s.hideToast);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authService.restoreSession().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <Loading fullScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
          <Toast visible={toast.visible} message={toast.message} type={toast.type} onDismiss={hideToast} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
