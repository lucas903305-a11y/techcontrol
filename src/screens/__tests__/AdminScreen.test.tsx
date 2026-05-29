import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AdminScreen from '../AdminScreen';

const mockStore = {
  user: null,
  isDarkMode: false,
  locale: 'es' as const,
  showToast: jest.fn(),
  setLocale: jest.fn(),
  setUser: jest.fn(),
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

describe('AdminScreen', () => {
  it('renders header "Panel Admin"', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    expect(getByText('Panel Admin')).toBeTruthy();
  });

  it('renders stat cards with titles', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    expect(getByText('Usuarios totales')).toBeTruthy();
    expect(getByText('Suscripciones Pro')).toBeTruthy();
    expect(getByText('Tickets hoy')).toBeTruthy();
    expect(getByText('Ingresos mes')).toBeTruthy();
  });

  it('renders stat card values', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    expect(getByText('24')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
    expect(getByText('8')).toBeTruthy();
    expect(getByText('$320K')).toBeTruthy();
  });

  it('renders management section header', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    expect(getByText('Gestión')).toBeTruthy();
  });

  it('renders all menu items', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    expect(getByText('Usuarios')).toBeTruthy();
    expect(getByText('Roles y permisos')).toBeTruthy();
    expect(getByText('Estadísticas globales')).toBeTruthy();
    expect(getByText('Configuración general')).toBeTruthy();
    expect(getByText('Suscripciones')).toBeTruthy();
  });

  it('shows toast when menu item is pressed', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Usuarios'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Usuarios — próximamente', 'info');
  });

  it('shows toast for each menu item with correct label', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Roles y permisos'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Roles y permisos — próximamente', 'info');
    fireEvent.press(getByText('Estadísticas globales'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Estadísticas globales — próximamente', 'info');
    fireEvent.press(getByText('Configuración general'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Configuración general — próximamente', 'info');
    fireEvent.press(getByText('Suscripciones'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Suscripciones — próximamente', 'info');
  });

  it('navigates back on back button press', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    const backButton = getByText('');
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders top technicians section', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    expect(getByText('Técnicos más activos')).toBeTruthy();
    expect(getByText('Técnico 1')).toBeTruthy();
    expect(getByText('Técnico 2')).toBeTruthy();
    expect(getByText('Técnico 3')).toBeTruthy();
  });

  it('renders technician ticket counts', () => {
    const { getByText } = render(<AdminScreen navigation={mockNavigation as any} />);
    expect(getByText('12 tickets resueltos')).toBeTruthy();
    expect(getByText('9 tickets resueltos')).toBeTruthy();
    expect(getByText('6 tickets resueltos')).toBeTruthy();
  });
});
