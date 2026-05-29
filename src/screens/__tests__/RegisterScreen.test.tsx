import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RegisterScreen from '../RegisterScreen';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: {
    signUp: jest.fn(),
  },
}));

const mockGoBack = jest.fn();
const mockReplace = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
  replace: mockReplace,
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('RegisterScreen', () => {
  it('renders title and subtitle', () => {
    const { getAllByText, getByText } = render(<RegisterScreen navigation={mockNavigation as any} />);
    expect(getAllByText('Crear cuenta').length).toBe(2); // title + button
    expect(getByText('Registrate como técnico profesional')).toBeTruthy();
  });

  it('renders input fields', () => {
    const { getByPlaceholderText } = render(<RegisterScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('Juan Pérez')).toBeTruthy();
    expect(getByPlaceholderText('tu@email.com')).toBeTruthy();
    expect(getByPlaceholderText('+54 11 2345-6789')).toBeTruthy();
    expect(getByPlaceholderText('Mínimo 8 caracteres')).toBeTruthy();
  });

  it('shows alert when required fields are empty', async () => {
    const { getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} />);
    await act(async () => {
      fireEvent.press(getAllByText('Crear cuenta')[1]); // button is the 2nd match
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Completá todos los campos obligatorios');
  });

  it('calls authService.signUp with name, email, password', async () => {
    (authService.signUp as jest.Mock).mockResolvedValueOnce({ user: {} });
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('Juan Pérez'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Mínimo 8 caracteres'), 'password123');
    await act(async () => {
      fireEvent.press(getAllByText('Crear cuenta')[1]);
    });
    expect(authService.signUp).toHaveBeenCalledWith('test@test.com', 'password123', 'Test User');
  });

  it('navigates to Main on successful registration', async () => {
    (authService.signUp as jest.Mock).mockResolvedValueOnce({ user: {} });
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('Juan Pérez'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Mínimo 8 caracteres'), 'pass');
    await act(async () => {
      fireEvent.press(getAllByText('Crear cuenta')[1]);
    });
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('shows error on registration failure', async () => {
    (authService.signUp as jest.Mock).mockRejectedValueOnce(new Error('Email ya registrado'));
    const { getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('Juan Pérez'), 'Test');
    fireEvent.changeText(getByPlaceholderText('tu@email.com'), 'existing@test.com');
    fireEvent.changeText(getByPlaceholderText('Mínimo 8 caracteres'), 'pass');
    await act(async () => {
      fireEvent.press(getAllByText('Crear cuenta')[1]);
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Email ya registrado');
  });

  it('goes back on "Iniciar sesión" press', () => {
    const { getByText } = render(<RegisterScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Iniciar sesión'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
