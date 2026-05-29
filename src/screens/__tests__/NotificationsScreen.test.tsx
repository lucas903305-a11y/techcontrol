import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotificationsScreen from '../NotificationsScreen';

jest.mock('@expo/vector-icons', () => require('../../../__jest_mocks__/expo-vector-icons'));

const mockStore = {
  locale: 'es' as const,
  isDarkMode: false,
};

jest.mock('../../store', () => ({
  useAppStore: (selector: any) => (selector ? selector(mockStore) : mockStore),
}));

const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack };

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NotificationsScreen', () => {
  it('renders header Notificaciones', () => {
    const { getByText } = render(<NotificationsScreen navigation={mockNavigation as any} />);
    expect(getByText('Notificaciones')).toBeTruthy();
  });

  it('renders toggle rows (Nuevos tickets, Cambios de estado, Recordatorios, Promociones, Sonido, Vibración)', () => {
    const { getByText } = render(<NotificationsScreen navigation={mockNavigation as any} />);
    expect(getByText('Nuevos tickets')).toBeTruthy();
    expect(getByText('Cambios de estado')).toBeTruthy();
    expect(getByText('Recordatorios')).toBeTruthy();
    expect(getByText('Promociones')).toBeTruthy();
    expect(getByText('Sonido')).toBeTruthy();
    expect(getByText('Vibración')).toBeTruthy();
  });

  it('renders switches for each toggle', () => {
    const { getAllByRole } = render(<NotificationsScreen navigation={mockNavigation as any} />);
    const switches = getAllByRole('switch');
    expect(switches).toHaveLength(6);
  });

  it('toggles are functional (change state when pressed)', () => {
    const { getAllByRole } = render(<NotificationsScreen navigation={mockNavigation as any} />);
    const switches = getAllByRole('switch');
    const initialValue = switches[0].props.value;
    fireEvent(switches[0], 'onValueChange', !initialValue);
    const switchesAfter = getAllByRole('switch');
    expect(switchesAfter[0].props.value).toBe(!initialValue);
  });
});
