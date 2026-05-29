import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    signIn: jest.fn(),
    signInWithGoogle: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  replace: mockReplace,
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('LoginScreen', () => {
  it('renders title and subtitle', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    expect(getByText('Bienvenido de vuelta')).toBeTruthy();
    expect(getByText('Iniciá sesión para gestionar tus trabajos')).toBeTruthy();
  });

  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('tu@email.com')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('shows alert when fields are empty', async () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    await act(async () => {
      fireEvent.press(getByText('Iniciar sesión'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Completá todos los campos obligatorios');
  });

  it('calls authService.signIn with email and password', async () => {
    (authService.signIn as jest.Mock).mockResolvedValueOnce({ user: {} });
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'password123');
    await act(async () => {
      fireEvent.press(getByText('Iniciar sesión'));
    });
    expect(authService.signIn).toHaveBeenCalledWith('test@test.com', 'password123');
  });

  it('navigates to Main on successful login', async () => {
    (authService.signIn as jest.Mock).mockResolvedValueOnce({ user: {} });
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'pass');
    await act(async () => {
      fireEvent.press(getByText('Iniciar sesión'));
    });
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('shows error on login failure', async () => {
    (authService.signIn as jest.Mock).mockRejectedValueOnce(new Error('Credenciales inválidas'));
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'wrong');
    await act(async () => {
      fireEvent.press(getByText('Iniciar sesión'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Credenciales inválidas');
  });

  it('navigates to Register on link press', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Crear cuenta'));
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('navigates to ResetPassword on forgot password', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('¿Olvidaste tu contraseña?'));
    expect(mockNavigate).toHaveBeenCalledWith('ResetPassword');
  });

  it('renders social login section', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    expect(getByText('o continuá con')).toBeTruthy();
  });

  it('renders navigation to register', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation as any} />);
    expect(getByText('¿No tenés cuenta?')).toBeTruthy();
  });
});
