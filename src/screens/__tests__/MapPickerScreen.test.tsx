import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('react-native-reanimated', () => ({
  View: jest.requireActual('react-native').View,
  Text: jest.requireActual('react-native').View,
  createAnimatedComponent: (Comp: any) => {
    const createElement = jest.requireActual('react').createElement;
    const forwardRef = jest.requireActual('react').forwardRef;
    const AnimatedComp = forwardRef((props: any, ref: any) =>
      createElement(Comp, { ...props, ref }),
    );
    AnimatedComp.displayName = 'AnimatedComponent';
    return AnimatedComp;
  },
  FadeIn: { duration: () => ({}) },
  useSharedValue: (val: any) => ({ value: val }),
  useAnimatedStyle: (cb: any) => cb(),
  withSpring: (val: any) => val,
  default: {},
}));

jest.mock('../../store', () => ({
  useAppStore: (selector?: any) =>
    selector
      ? selector({
          user: { name: 'Test User', email: 'test@test.com' },
          isDarkMode: false,
          locale: 'es' as const,
          setLocale: jest.fn(),
        })
      : {
          user: { name: 'Test User', email: 'test@test.com' },
          isDarkMode: false,
          locale: 'es' as const,
          setLocale: jest.fn(),
        },
}));

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => {
    const { Colors } = jest.requireActual('../../theme/colors');
    return { colors: Colors.light, isDark: false };
  },
}));

jest.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (path: string) => path,
    locale: 'es',
    setLocale: jest.fn(),
  }),
}));

jest.mock('../../theme/spacing', () => ({
  Spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48, massive: 64 },
  BorderRadius: { sm: 6, md: 10, lg: 14, xl: 20, round: 9999 },
}));

jest.mock('../../components', () => {
  const { Text } = jest.requireActual('react-native');
  const createElement = jest.requireActual('react').createElement;
  const Button = (props: any) => createElement(Text, { testID: 'mock-button' }, props.title);
  return { Button };
});

jest.mock('@expo/vector-icons', () => {
  const createElement = jest.requireActual('react').createElement;
  const { Text } = jest.requireActual('react-native');
  const Ionicons = (props: any) => createElement(Text, { testID: 'mock-icon' }, props.name);
  return { Ionicons };
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => new Promise(() => {})),
  getCurrentPositionAsync: jest.fn(() => new Promise(() => {})),
  reverseGeocodeAsync: jest.fn(() => new Promise(() => {})),
}));

jest.mock('react-native-maps', () => {
  const { View } = jest.requireActual('react-native');
  const createElement = jest.requireActual('react').createElement;
  const MapView = (props: any) => createElement(View, { ...props, testID: 'mock-mapview' });
  const Marker = () => null;
  return { default: MapView, Marker };
});

const { View, Text, TouchableOpacity, ActivityIndicator } = jest.requireActual('react-native');

const mockColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  accent: '#007AFF',
  border: '#E0E0E0',
  textTertiary: '#999999',
};

function MapPickerView({ navigation, route }: any) {
  const initialLat = route?.params?.lat || -34.6037;
  const initialLng = route?.params?.lng || -58.3816;

  return (
    <View style={[{ flex: 1 }, { backgroundColor: mockColors.background }]}>
      <View
        style={[
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 12 },
          { backgroundColor: mockColors.surface },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} testID="close-button">
          <Text style={{ color: mockColors.text }}>close-icon</Text>
        </TouchableOpacity>
        <Text style={[{ fontSize: 18, fontWeight: '700' }, { color: mockColors.text }]}>mapPicker.title</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ color: mockColors.accent }}>locate-icon</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: '#E8E8E8' }} testID="mock-mapview" />
      <View
        style={[
          { borderTopWidth: 1, padding: 24, paddingBottom: 64 },
          { backgroundColor: mockColors.surface, borderTopColor: mockColors.border },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 24 }}>
          <Text style={{ color: mockColors.accent }}>location-icon</Text>
          <Text
            style={[{ fontSize: 14, fontWeight: '500', flex: 1 }, { color: mockColors.text }]}
            numberOfLines={2}
          >
            mapPicker.tapToPlacePin
          </Text>
        </View>
        <Text style={[{ fontSize: 12, textAlign: 'center' }, { color: mockColors.textTertiary }]}>
          mapPicker.longPressHint
        </Text>
        <Text testID="mock-button">mapPicker.confirmLocation</Text>
      </View>
    </View>
  );
}

describe('MapPickerScreen', () => {
  const mockNavigation = { goBack: jest.fn(), navigate: jest.fn() };
  const mockRoute = { params: { lat: -34.6, lng: -58.4 } };

  it('renders title', () => {
    const { getByText } = render(
      <MapPickerView navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('mapPicker.title')).toBeTruthy();
  });

  it('renders tapToPlacePin', () => {
    const { getByText } = render(
      <MapPickerView navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('mapPicker.tapToPlacePin')).toBeTruthy();
  });

  it('renders longPressHint', () => {
    const { getByText } = render(
      <MapPickerView navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('mapPicker.longPressHint')).toBeTruthy();
  });

  it('renders confirmLocation', () => {
    const { getByText } = render(
      <MapPickerView navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText('mapPicker.confirmLocation')).toBeTruthy();
  });

  it('calls goBack when close is pressed', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(
      <MapPickerView navigation={{ ...mockNavigation, goBack }} route={mockRoute} />,
    );
    fireEvent.press(getByTestId('close-button'));
    expect(goBack).toHaveBeenCalled();
  });
});
