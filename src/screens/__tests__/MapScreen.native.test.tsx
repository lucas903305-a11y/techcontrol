import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapScreen from '../MapScreen';
import { api } from '../../services/api';

jest.mock('../../store', () => {
  const data = {
    user: { name: 'Test User', email: 'test@test.com' },
    isDarkMode: false,
    locale: 'es' as const,
    setLocale: jest.fn(),
  };
  return {
    useAppStore: (selector: any) => (selector ? selector(data) : data),
  };
});

jest.mock('../../services/api', () => ({
  api: {
    getClients: jest.fn(),
  },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: -34.6037, longitude: -58.3816 } })),
}));

jest.mock('react-native-maps', () => {
  const RN = require('react-native');
  const createElement = require('react').createElement;
  const forwardRef = require('react').forwardRef;
  const MapView = forwardRef((props: any, ref: any) =>
    createElement(RN.View, { ...props, ref }, props.children)
  );
  const Marker = (props: any) => createElement(RN.View, props, props.children);
  return { default: MapView, Marker };
});

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockNavigation = { goBack: mockGoBack, navigate: mockNavigate };

const mockClients = [
  { id: '1', user_id: '1', name: 'Edificio Torres', phone: '+54 11 4555-1234', address: 'Av. Corrientes 1234', lat: -34.6037, lng: -58.3816, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', user_id: '1', name: 'Tech Solutions SA', phone: '+54 11 4777-5678', address: 'Calle Florida 567', lat: -34.5937, lng: -58.3716, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MapScreen native', () => {
  it('renders header text', () => {
    (api.getClients as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<MapScreen navigation={mockNavigation as any} />);
    expect(getByText('Mapa de clientes')).toBeTruthy();
  });

  it('renders map placeholder or loading state', () => {
    (api.getClients as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<MapScreen navigation={mockNavigation as any} />);
    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('renders client list nearby', async () => {
    (api.getClients as jest.Mock).mockResolvedValue(mockClients);
    const { findByText } = render(<MapScreen navigation={mockNavigation as any} />);
    expect(await findByText(/Clientes cercanos/)).toBeTruthy();
  });

  it('back button navigates back', () => {
    const { UNSAFE_root } = render(<MapScreen navigation={mockNavigation as any} />);
    const backButtons = UNSAFE_root.findAllByProps({ name: 'arrow-back' });
    if (backButtons.length > 0) {
      fireEvent.press(backButtons[0]);
    }
    expect(mockGoBack).toHaveBeenCalled();
  });
});
