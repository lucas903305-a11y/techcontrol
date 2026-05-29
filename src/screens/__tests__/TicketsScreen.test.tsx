import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import TicketsScreen from '../TicketsScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    getTickets: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb: any) => cb()),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: mockGoBack };

const mockTickets = [
  { id: '1', user_id: '1', client_id: '1', client_name: 'Edificio Torres', title: 'Instalación de cámara Dahua', description: 'Instalar 4 cámaras', status: 'pending' as const, priority: 'high' as const, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: '1', client_id: '2', client_name: 'Tech Solutions SA', title: 'Mantenimiento servidores', description: 'Revisión trimestral', status: 'in_progress' as const, priority: 'urgent' as const, created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString(), scheduled_date: new Date(Date.now() + 3600000).toISOString() },
  { id: '3', user_id: '1', client_id: '3', client_name: 'Oficinas Norte', title: 'Reparación red WiFi', description: 'Cobertura insuficiente', status: 'completed' as const, priority: 'medium' as const, created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date().toISOString() },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TicketsScreen', () => {
  it('renders header "Tickets"', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { findByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Tickets')).toBeTruthy();
  });

  it('renders search bar', () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { getByPlaceholderText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('Buscar ticket...')).toBeTruthy();
  });

  it('renders filter chips', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { findByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Todas')).toBeTruthy();
    expect(await findByText('Pendientes')).toBeTruthy();
    expect(await findByText('Completadas')).toBeTruthy();
  });

  it('renders filter chip "En proceso"', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { getAllByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    const chips = await getAllByText('En proceso');
    expect(chips.length).toBeGreaterThanOrEqual(1);
  });

  it('renders ticket list items', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { findByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Instalación de cámara Dahua')).toBeTruthy();
    expect(await findByText('Mantenimiento servidores')).toBeTruthy();
    expect(await findByText('Reparación red WiFi')).toBeTruthy();
  });

  it('shows empty state when no tickets', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue([]);
    const { findByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    expect(await findByText('No hay tickets')).toBeTruthy();
  });

  it('FAB navigates to NewTicket', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue([]);
    const { UNSAFE_root } = render(<TicketsScreen navigation={mockNavigation as any} />);
    const addIcon = UNSAFE_root.findByProps({ name: 'add-circle' });
    fireEvent.press(addIcon);
    expect(mockNavigate).toHaveBeenCalledWith('NewTicket');
  });

  it('search filters tickets', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { getByPlaceholderText, getByText, queryByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    const searchInput = await getByPlaceholderText('Buscar ticket...');
    fireEvent.changeText(searchInput, 'cámara');
    expect(getByText('Instalación de cámara Dahua')).toBeTruthy();
    expect(queryByText('Mantenimiento servidores')).toBeNull();
    expect(queryByText('Reparación red WiFi')).toBeNull();
  });

  it('filter changes visible tickets to Pendientes', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { findByText, queryByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    const pendingFilter = await findByText('Pendientes');
    fireEvent.press(pendingFilter);
    expect(queryByText('Instalación de cámara Dahua')).toBeTruthy();
    expect(queryByText('Mantenimiento servidores')).toBeNull();
    expect(queryByText('Reparación red WiFi')).toBeNull();
  });

  it('filter changes visible tickets to Completadas', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { findByText, queryByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    const completedFilter = await findByText('Completadas');
    fireEvent.press(completedFilter);
    expect(queryByText('Reparación red WiFi')).toBeTruthy();
    expect(queryByText('Instalación de cámara Dahua')).toBeNull();
    expect(queryByText('Mantenimiento servidores')).toBeNull();
  });

  it('ticket card navigates to detail on press', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { findByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Instalación de cámara Dahua'));
    expect(mockNavigate).toHaveBeenCalledWith('TicketDetail', { ticket: expect.objectContaining({ title: 'Instalación de cámara Dahua' }) });
  });

  it('back button calls goBack', () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { UNSAFE_root } = render(<TicketsScreen navigation={mockNavigation as any} />);
    const backIcon = UNSAFE_root.findByProps({ name: 'arrow-back' });
    fireEvent.press(backIcon);
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders ticket client names', async () => {
    (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
    const { findByText } = render(<TicketsScreen navigation={mockNavigation as any} />);
    expect(await findByText(/Edificio Torres/)).toBeTruthy();
    expect(await findByText(/Tech Solutions SA/)).toBeTruthy();
  });
});
