import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AboutScreen from '../AboutScreen';

const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack };

describe('AboutScreen', () => {
  it('renders app name and version', () => {
    const { getByText } = render(<AboutScreen navigation={mockNavigation as any} />);
    expect(getByText('TechControl')).toBeTruthy();
    expect(getByText('Versión 1.0.0')).toBeTruthy();
  });

  it('renders description', () => {
    const { getByText } = render(<AboutScreen navigation={mockNavigation as any} />);
    expect(getByText(/TechControl es la plataforma/)).toBeTruthy();
  });

  it('renders features list', () => {
    const { getByText } = render(<AboutScreen navigation={mockNavigation as any} />);
    expect(getByText('Gestión de clientes y equipos')).toBeTruthy();
    expect(getByText('Sistema de tickets inteligente')).toBeTruthy();
    expect(getByText('Presupuestos con PDF')).toBeTruthy();
  });

  it('renders technologies', () => {
    const { getByText } = render(<AboutScreen navigation={mockNavigation as any} />);
    expect(getByText('React Native')).toBeTruthy();
    expect(getByText('Expo')).toBeTruthy();
    expect(getByText('Supabase')).toBeTruthy();
    expect(getByText('OpenAI')).toBeTruthy();
  });

  it('renders copyright', () => {
    const { getByText } = render(<AboutScreen navigation={mockNavigation as any} />);
    expect(getByText(/© 2026 TechControl/)).toBeTruthy();
  });

  it('renders back button and header', () => {
    const { getByText } = render(<AboutScreen navigation={mockNavigation as any} />);
    expect(getByText('Acerca de')).toBeTruthy();
  });
});
