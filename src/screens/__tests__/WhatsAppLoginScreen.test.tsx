import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import WhatsAppLoginScreen from '../WhatsAppLoginScreen';

const mockReplace = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { replace: mockReplace, goBack: mockGoBack };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  jest.useFakeTimers();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('WhatsAppLoginScreen', () => {
  it('renders header "WhatsApp"', () => {
    const { getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    expect(getByText('WhatsApp')).toBeTruthy();
  });

  it('renders phone input step initially', () => {
    const { getByPlaceholderText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('+54 11 2345-6789')).toBeTruthy();
  });

  it('renders "Enviar código" button', () => {
    const { getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    expect(getByText('Enviar código')).toBeTruthy();
  });

  it('shows alert when phone is empty', async () => {
    const { getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    await act(async () => {
      fireEvent.press(getByText('Enviar código'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ingresá tu número de WhatsApp');
  });

  it('sends code and switches to verification step', async () => {
    const { getByPlaceholderText, getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('+54 11 2345-6789'), '+54 11 5555-1234');
    await act(async () => {
      fireEvent.press(getByText('Enviar código'));
    });
    act(() => { jest.runAllTimers(); });
    expect(Alert.alert).toHaveBeenCalledWith('Código enviado', 'Simulación: código 123456');
  });

  it('renders verification code input after switching step', async () => {
    const { getByPlaceholderText, getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('+54 11 2345-6789'), '+54 11 5555-1234');
    await act(async () => {
      fireEvent.press(getByText('Enviar código'));
    });
    act(() => { jest.runAllTimers(); });
    expect(getByPlaceholderText('123456')).toBeTruthy();
  });

  it('shows alert when verification code is empty', async () => {
    const { getByPlaceholderText, getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('+54 11 2345-6789'), '+54 11 5555-1234');
    await act(async () => {
      fireEvent.press(getByText('Enviar código'));
    });
    act(() => { jest.runAllTimers(); });
    await act(async () => {
      fireEvent.press(getByText('Verificar'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ingresá el código de verificación');
  });

  it('navigates to Main on successful verification', async () => {
    const { getByPlaceholderText, getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('+54 11 2345-6789'), '+54 11 5555-1234');
    await act(async () => {
      fireEvent.press(getByText('Enviar código'));
    });
    act(() => { jest.runAllTimers(); });
    fireEvent.changeText(getByPlaceholderText('123456'), '123456');
    await act(async () => {
      fireEvent.press(getByText('Verificar'));
    });
    act(() => { jest.runAllTimers(); });
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('cancel button navigates back', () => {
    const { getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Cancelar'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders WhatsApp logo icon', () => {
    const { UNSAFE_root } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    const icon = UNSAFE_root.findByProps({ name: 'logo-whatsapp' });
    expect(icon).toBeTruthy();
  });

  it('renders subtitle with initial instructions', () => {
    const { getByText } = render(<WhatsAppLoginScreen navigation={mockNavigation as any} />);
    expect(getByText('Ingresá tu número de WhatsApp con código de país')).toBeTruthy();
  });
});
