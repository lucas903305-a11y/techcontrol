import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedTabIcon } from '../components/AnimatedTabIcon';
import { useAppStore } from '../store';
import { Colors } from '../theme/colors';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  DashboardScreen,
  ClientsScreen,
  TicketsScreen,
  MapScreen,
  InventoryScreen,
  ReportsScreen,
  ProfileScreen,
  SettingsScreen,
  AdminScreen,
  NewTicketScreen,
  NewClientScreen,
  AIAssistantScreen,
  WhatsAppLoginScreen,
  PlaceholderScreen,
  TicketDetailScreen,
  ClientDetailScreen,
  NewQuoteScreen,
  EditProfileScreen,
  CompanyScreen,
  BillingScreen,
  NotificationsScreen,
  SecurityScreen,
  NewInventoryScreen,
  HelpScreen,
  AboutScreen,
  MapPickerScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const isDark = useAppStore((s) => s.isDarkMode);
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Clients':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Tickets':
              iconName = focused ? 'git-branch' : 'git-branch-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'AI':
              iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
              break;
          }
          return <AnimatedTabIcon name={iconName} size={size} color={color} focused={focused} />;
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          borderTopWidth: 0.5,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
          height: insets.bottom > 0 ? 56 + insets.bottom : 58,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Clients" component={ClientsScreen} options={{ tabBarLabel: 'Clientes' }} />
      <Tab.Screen name="Tickets" component={TicketsScreen} options={{ tabBarLabel: 'Tickets' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Mapa' }} />
      <Tab.Screen name="AI" component={AIAssistantScreen} options={{ tabBarLabel: 'IA' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const placeholder = (title: string) => (props: any) =>
    <PlaceholderScreen {...props} route={{ ...props.route, params: { title } }} />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="WhatsAppLogin" component={WhatsAppLoginScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Inventory" component={InventoryScreen} />
      <Stack.Screen name="NewTicket" component={NewTicketScreen} />
      <Stack.Screen name="NewClient" component={NewClientScreen} />
      <Stack.Screen name="MapPicker" component={MapPickerScreen} />

      {/* Profile sub-screens */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Company" component={CompanyScreen} />
      <Stack.Screen name="Billing" component={BillingScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />

      {/* Dashboard quick actions */}
      <Stack.Screen name="NewQuote" component={NewQuoteScreen} />

      {/* Detail screens */}
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
      <Stack.Screen name="NewInventory" component={NewInventoryScreen} />
    </Stack.Navigator>
  );
}
