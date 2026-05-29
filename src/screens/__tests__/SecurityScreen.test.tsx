import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SecurityScreen from '../SecurityScreen';
import { authService } from '../../services/auth';

jest.mock('@expo/vector-icons', () => require('../../../__jest_mocks__/expo-vector-icons'));

jest.mock('../../services/auth', () => ({
  authService: { resetPassword: jest.fn().mockResolvedValue(undefined) },
}));

const mockStore = {
  showToast: jest.fn(),
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
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SecurityScreen', () => {
  it('renders header Seguridad', () => {
    const { getByText } = render(<SecurityScreen navigation={mockNavigation as any} />);
    expect(getByText('Seguridad')).toBeTruthy();
  });

  it('renders current/old password input', () => {
    const { getByText } = render(<SecurityScreen navigation={mockNavigation as any} />);
    expect(getByText('Contraseña actual')).toBeTruthy();
  });

  it('renders new password input', () => {
    const { getByText } = render(<SecurityScreen navigation={mockNavigation as any} />);
    expect(getByText('Nueva contraseña')).toBeTruthy();
  });

  it('renders Actualizar contraseña button', () => {
    const { getByText } = render(<SecurityScreen navigation={mockNavigation as any} />);
    expect(getByText('Actualizar contraseña')).toBeTruthy();
  });

  it('validates minimum 8 characters', () => {
    const { getByText, getAllByDisplayValue } = render(<SecurityScreen navigation={mockNavigation as any} />);
    const inputs = getAllByDisplayValue('');
    fireEvent.changeText(inputs[0], 'oldpass123');
    fireEvent.changeText(inputs[1], 'short');
    fireEvent.press(getByText('Actualizar contraseña'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'La contraseña debe tener al menos 8 caracteres');
  });

  it('renders security options section (Biométrico, PIN, 2FA)', () => {
    const { getByText } = render(<SecurityScreen navigation={mockNavigation as any} />);
    expect(getByText('Biométrico')).toBeTruthy();
    expect(getByText('PIN de acceso')).toBeTruthy();
    expect(getByText('2FA')).toBeTruthy();
  });

  it('calls authService.resetPassword on save', async () => {
    const { getByText, getAllByDisplayValue } = render(<SecurityScreen navigation={mockNavigation as any} />);
    const inputs = getAllByDisplayValue('');
    fireEvent.changeText(inputs[0], 'currentPass123');
    fireEvent.changeText(inputs[1], 'newPass12345');
    fireEvent.press(getByText('Actualizar contraseña'));
    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith('newPass12345');
    });
    expect(mockStore.showToast).toHaveBeenCalledWith('Contraseña actualizada', 'success');
  });
});
