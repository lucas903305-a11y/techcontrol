import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ResetPasswordScreen from '../ResetPasswordScreen';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    resetPassword: jest.fn(),
  },
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

describe('ResetPasswordScreen', () => {
  it('renders header "Restablecer contraseña"', () => {
    const { getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    expect(getByText('Restablecer contraseña')).toBeTruthy();
  });

  it('renders subtitle', () => {
    const { getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    expect(getByText('Te enviaremos un link al email registrado')).toBeTruthy();
  });

  it('renders email input', () => {
    const { getByPlaceholderText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('tu@email.com')).toBeTruthy();
  });

  it('renders "Enviar link" button', () => {
    const { getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    expect(getByText('Enviar link')).toBeTruthy();
  });

  it('renders "Volver" button', () => {
    const { getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    expect(getByText('Volver')).toBeTruthy();
  });

  it('back button navigates back', () => {
    const { getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Volver'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows alert when email is empty', async () => {
    const { getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    await act(async () => {
      fireEvent.press(getByText('Enviar link'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ingresá tu email');
  });

  it('calls authService.resetPassword with email', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    await act(async () => {
      fireEvent.press(getByText('Enviar link'));
    });
    expect(authService.resetPassword).toHaveBeenCalledWith('test@test.com');
  });

  it('shows success toast and goes back on success', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValueOnce(undefined);
    const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    await act(async () => {
      fireEvent.press(getByText('Enviar link'));
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows error toast on failure', async () => {
    (authService.resetPassword as jest.Mock).mockRejectedValueOnce(new Error('Failed'));
    const { getByPlaceholderText, getByText } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    await act(async () => {
      fireEvent.press(getByText('Enviar link'));
    });
    expect(authService.resetPassword).toHaveBeenCalledWith('test@test.com');
  });

  it('shows lock icon', () => {
    const { UNSAFE_root } = render(<ResetPasswordScreen navigation={mockNavigation as any} />);
    const lockIcon = UNSAFE_root.findByProps({ name: 'lock-closed-outline' });
    expect(lockIcon).toBeTruthy();
  });
});
