import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SettingsScreen from '../SettingsScreen';

const mockStore = {
  locale: 'es' as const,
  isDarkMode: false,
  setLocale: jest.fn(),
  toggleDarkMode: jest.fn(),
  showToast: jest.fn(),
  logout: jest.fn(),
};

jest.mock('../../store', () => ({
  useAppStore: (selector: any) => (selector ? selector(mockStore) : mockStore),
}));

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockNavigation = { goBack: mockGoBack, navigate: mockNavigate };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SettingsScreen', () => {
  it('renders header Configuración', () => {
    const { getByText } = render(<SettingsScreen navigation={mockNavigation as any} />);
    expect(getByText('Configuración')).toBeTruthy();
  });

  it('renders dark mode switch', () => {
    const { getByText } = render(<SettingsScreen navigation={mockNavigation as any} />);
    expect(getByText('Modo oscuro')).toBeTruthy();
  });

  it('renders language selector with current value', () => {
    const { getByText } = render(<SettingsScreen navigation={mockNavigation as any} />);
    expect(getByText('Español')).toBeTruthy();
  });

  it('renders delete account action', () => {
    const { getByText } = render(<SettingsScreen navigation={mockNavigation as any} />);
    expect(getByText('Eliminar cuenta')).toBeTruthy();
  });

  it('pressing language toggle changes locale', () => {
    const { getByText } = render(<SettingsScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Español'));
    expect(mockStore.setLocale).toHaveBeenCalledWith('en');
  });

  it('pressing back navigates back', () => {
    const { getByLabelText } = render(<SettingsScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByLabelText('back'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('export data shows toast', () => {
    const { getByLabelText } = render(<SettingsScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByLabelText('Exportar datos'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Cargando...', 'info');
  });
});
