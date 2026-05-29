import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NewClientScreen from '../NewClientScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    createClient: jest.fn(),
    updateClient: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NewClientScreen', () => {
  it('renders header "Nuevo cliente"', () => {
    const { getByText } = render(<NewClientScreen navigation={mockNavigation as any} />);
    expect(getByText('Nuevo cliente')).toBeTruthy();
  });

  it('renders input fields with labels: Nombre, Teléfono, Email, Dirección', () => {
    const { getByText } = render(<NewClientScreen navigation={mockNavigation as any} />);
    expect(getByText('Nombre *')).toBeTruthy();
    expect(getByText('Teléfono')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Dirección')).toBeTruthy();
  });

  it('renders "Seleccionar en mapa" button', () => {
    const { getByText } = render(<NewClientScreen navigation={mockNavigation as any} />);
    expect(getByText('Seleccionar en mapa')).toBeTruthy();
  });

  it('save button validates required fields', async () => {
    const { getByText } = render(<NewClientScreen navigation={mockNavigation as any} />);
    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Completá todos los campos obligatorios');
  });

  it('save button calls api.createClient with correct data', async () => {
    (api.createClient as jest.Mock).mockResolvedValue({ id: '1' });
    const { getByText, getByPlaceholderText } = render(<NewClientScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('Nombre'), 'Test Client');
    fireEvent.changeText(getByPlaceholderText('+54 11 2345-6789'), '123456789');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Dirección'), 'Test Address');
    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });
    expect(api.createClient).toHaveBeenCalledWith({
      name: 'Test Client',
      phone: '123456789',
      email: 'test@test.com',
      address: 'Test Address',
      notes: '',
      lat: undefined,
      lng: undefined,
    });
  });

  it('edit mode shows "Editar cliente" header', () => {
    const route = { params: { client: { id: '1', name: 'Test', phone: '123', email: 'test@test.com', address: 'Street' } } };
    const { getByText } = render(<NewClientScreen navigation={mockNavigation as any} route={route as any} />);
    expect(getByText('Editar cliente')).toBeTruthy();
  });
});
