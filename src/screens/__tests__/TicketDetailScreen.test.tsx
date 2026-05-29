import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert, Share } from 'react-native';
import TicketDetailScreen from '../TicketDetailScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    getTicket: jest.fn(),
    updateTicket: jest.fn(),
    deleteTicket: jest.fn(),
    getClients: jest.fn(),
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

const mockRoute = { params: { ticket: mockTicket } };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TicketDetailScreen', () => {
  it('renders ticket title, description, priority, status', () => {
    const { getByText } = render(
      <TicketDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Instalación de cámara')).toBeTruthy();
    expect(getByText('Instalar 4 cámaras de seguridad')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
    expect(getByText('high')).toBeTruthy();
  });

  it('renders client name', () => {
    const { getByText } = render(
      <TicketDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByText('Edificio Torres')).toBeTruthy();
  });

  it('renders comment section with placeholder', () => {
    const { getByPlaceholderText } = render(
      <TicketDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    expect(getByPlaceholderText('Agregar comentario...')).toBeTruthy();
  });

  it('change status button works', async () => {
    (api.updateTicket as jest.Mock).mockResolvedValueOnce(undefined);
    const { getByText } = render(
      <TicketDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    await act(async () => {
      fireEvent.press(getByText('Cambiar'));
    });
    await act(async () => {
      fireEvent.press(getByText('Completado'));
    });
    expect(api.updateTicket).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ status: 'completed' })
    );
  });

  it('delete button shows confirmation alert', async () => {
    const { getByText } = render(
      <TicketDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    await act(async () => {
      fireEvent.press(getByText('trash-outline'));
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Eliminar',
      'Confirmar',
      expect.any(Array)
    );
  });

  it('back button navigates back', async () => {
    const { getByText } = render(
      <TicketDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    await act(async () => {
      fireEvent.press(getByText('arrow-back'));
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('share button shares ticket', async () => {
    jest.spyOn(Share, 'share').mockResolvedValue({ action: 'shared' } as any);
    const { getByText } = render(
      <TicketDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
    await act(async () => {
      fireEvent.press(getByText('share-outline'));
    });
    expect(Share.share).toHaveBeenCalled();
  });
});
