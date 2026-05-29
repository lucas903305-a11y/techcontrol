import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HelpScreen from '../HelpScreen';

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

describe('HelpScreen', () => {
  it('renders header Ayuda y soporte', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation as any} />);
    expect(getByText('Ayuda y soporte')).toBeTruthy();
  });

  it('renders FAQ section with Preguntas frecuentes', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation as any} />);
    expect(getByText('Preguntas frecuentes')).toBeTruthy();
  });

  it('renders FAQ items', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation as any} />);
    expect(getByText('¿Cómo creo un ticket?')).toBeTruthy();
    expect(getByText('¿Cómo agrego un cliente?')).toBeTruthy();
    expect(getByText('¿Cómo genero un presupuesto?')).toBeTruthy();
    expect(getByText('¿Cómo comparto por WhatsApp?')).toBeTruthy();
  });

  it('renders FAQ item answers', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation as any} />);
    expect(getByText(/Andá a Tickets/)).toBeTruthy();
    expect(getByText(/Andá a Clientes/)).toBeTruthy();
  });

  it('renders Contact section', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation as any} />);
    expect(getByText('Contacto')).toBeTruthy();
  });

  it('renders contact items (WhatsApp, Email, Website)', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation as any} />);
    expect(getByText('Soporte por WhatsApp')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Web')).toBeTruthy();
  });

  it('back button navigates back', () => {
    const { getByText } = render(<HelpScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('arrow-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
