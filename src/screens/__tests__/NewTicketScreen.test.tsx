import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NewTicketScreen from '../NewTicketScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    getClients: jest.fn(),
    createTicket: jest.fn(),
    updateTicket: jest.fn(),
  },
}));

jest.mock('../../store', () => ({
  useAppStore: jest.fn((selector: any) => {
    const state = { locale: 'es' as const, isDarkMode: false, showToast: jest.fn() };
    return selector ? selector(state) : state;
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  const React = require('react');
  const createIcon = (name: string) => {
    const Icon = React.forwardRef((props: any, ref: any) =>
      React.createElement(Text, { ...props, ref }, props.name || name)
    );
    Icon.displayName = name;
    return Icon;
  };
  return {
    Ionicons: createIcon('Ionicons'),
  };
});

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockNavigation = { goBack: mockGoBack, navigate: mockNavigate };

const mockTicket = {
  id: '1',
  user_id: '1',
  client_id: '1',
  client_name: 'Edificio Torres',
  title: 'Instalación de cámara',
  description: 'Instalar 4 cámaras de seguridad',
  status: 'pending' as const,
  priority: 'high' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  comments: [],
};

const mockClients = [
  { id: '1', name: 'Cliente A', phone: '+54 11 1234-5678' },
  { id: '2', name: 'Cliente B', phone: '+54 11 8765-4321' },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  (api.getClients as jest.Mock).mockResolvedValue(mockClients);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NewTicketScreen', () => {
  it('renders title "Nuevo ticket" when creating', () => {
    const { getAllByText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    expect(getAllByText('Nuevo ticket').length).toBeGreaterThanOrEqual(1);
  });

  it('renders "Editar" when editing', () => {
    const { getByText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: { ticket: mockTicket } }} />
    );
    expect(getByText('Editar')).toBeTruthy();
    expect(getByText('Guardar')).toBeTruthy();
  });

  it('renders title input field', () => {
    const { getByPlaceholderText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    expect(getByPlaceholderText('Título')).toBeTruthy();
  });

  it('renders description input', () => {
    const { getByPlaceholderText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    expect(getByPlaceholderText('Descripción')).toBeTruthy();
  });

  it('renders priority selector', () => {
    const { getByText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    expect(getByText('Baja')).toBeTruthy();
    expect(getByText('Media')).toBeTruthy();
    expect(getByText('Alta')).toBeTruthy();
    expect(getByText('Urgente')).toBeTruthy();
  });

  it('renders client selector dropdown', () => {
    const { getByText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    expect(getByText('Nombre')).toBeTruthy();
  });

  it('save button creates ticket with correct data', async () => {
    (api.createTicket as jest.Mock).mockResolvedValue({ id: 'new-id' });
    const { getByPlaceholderText, getAllByText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    fireEvent.changeText(getByPlaceholderText('Título'), 'Nuevo ticket de prueba');
    await act(async () => {
      fireEvent.press(getAllByText('Nuevo ticket')[1]);
    });
    expect(api.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Nuevo ticket de prueba',
        priority: 'medium',
      })
    );
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows validation error when title is empty', async () => {
    const { getAllByText } = render(
      <NewTicketScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    await act(async () => {
      fireEvent.press(getAllByText('Nuevo ticket')[1]);
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Completá todos los campos obligatorios');
    expect(api.createTicket).not.toHaveBeenCalled();
  });
});
