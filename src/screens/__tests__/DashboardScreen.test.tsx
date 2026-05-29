import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';
import DashboardScreen from '../DashboardScreen';
import { api } from '../../services/api';

jest.mock('../../store', () => {
  const data = {
    user: { name: 'Test User', email: 'test@test.com' },
    isDarkMode: false,
    locale: 'es',
    stats: null,
    loading: false,
    setLocale: jest.fn(),
    setUser: jest.fn(),
  };
  return {
    useAppStore: (selector: any) => (selector ? selector(data) : data),
  };
});

jest.mock('../../services/api', () => ({
  api: {
    getDashboardStats: jest.fn(),
    getTickets: jest.fn(),
  },
}));

const mockStats = {
  open_tickets: 3,
  today_jobs: 5,
  monthly_earnings: 245000,
  recent_clients: 12,
  completion_rate: 75,
  avg_response_time: 45,
};

const mockTickets = [
  { id: '1', user_id: '1', client_id: '1', client_name: 'Cliente A', title: 'Instalación de cámara', status: 'pending', priority: 'high', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: '1', client_id: '2', client_name: 'Cliente B', title: 'Mantenimiento servidores', status: 'in_progress', priority: 'urgent', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), scheduled_date: new Date().toISOString() },
  { id: '3', user_id: '1', client_id: '3', client_name: 'Cliente C', title: 'Reparación red WiFi', status: 'completed', priority: 'medium', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

beforeEach(() => {
  jest.clearAllMocks();
  (api.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
  (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('DashboardScreen', () => {
  it('renders header with welcome text', async () => {
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    expect(await findByText('¡Hola! Test')).toBeTruthy();
  });

  it('renders stat cards with titles', async () => {
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    expect(await findByText('Tickets abiertos')).toBeTruthy();
    expect(await findByText('Trabajos hoy')).toBeTruthy();
    expect(await findByText('Clientes')).toBeTruthy();
    expect(await findByText('Completados')).toBeTruthy();
  });

  it('renders stat card values after loading', async () => {
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    expect(await findByText('3')).toBeTruthy();
    expect(await findByText('5')).toBeTruthy();
    expect(await findByText('12')).toBeTruthy();
    expect(await findByText('75%')).toBeTruthy();
  });

  it('renders quick action buttons', async () => {
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    expect(await findByText('Nuevo ticket')).toBeTruthy();
    expect(await findByText('Nuevo cliente')).toBeTruthy();
    expect(await findByText('Presupuesto')).toBeTruthy();
    expect(await findByText('Mapa')).toBeTruthy();
  });

  it('navigates to NewTicket on quick action press', async () => {
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Nuevo ticket'));
    expect(mockNavigate).toHaveBeenCalledWith('NewTicket', undefined);
  });

  it('navigates to Main/Map on Map action press', async () => {
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Mapa'));
    expect(mockNavigate).toHaveBeenCalledWith('Main', { screen: 'Map' });
  });

  it('renders recent tickets section with ticket titles', async () => {
    const { findByText, findAllByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    expect(await findByText('Tickets recientes')).toBeTruthy();
    expect((await findAllByText('Instalación de cámara')).length).toBe(2);
    expect((await findAllByText('Mantenimiento servidores')).length).toBe(2);
    expect(await findByText('Reparación red WiFi')).toBeTruthy();
  });

  it('renders upcoming jobs section', async () => {
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    expect(await findByText('Próximos trabajos')).toBeTruthy();
    expect(await findByText('Cliente A')).toBeTruthy();
    expect(await findByText('Cliente B')).toBeTruthy();
  });

  it('renders empty state when no tickets', async () => {
    (api.getTickets as jest.Mock).mockResolvedValueOnce([]);
    const { findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    expect(await findByText('Sin resultados')).toBeTruthy();
  });

  it('pull-to-refresh reloads data', async () => {
    const { UNSAFE_getByType, findByText } = render(<DashboardScreen navigation={mockNavigation as any} />);
    await findByText('3');
    expect(api.getDashboardStats).toHaveBeenCalledTimes(1);
    const refreshControl = UNSAFE_getByType(RefreshControl);
    act(() => { refreshControl.props.onRefresh(); });
    await waitFor(() => {
      expect(api.getDashboardStats).toHaveBeenCalledTimes(2);
      expect(api.getTickets).toHaveBeenCalledTimes(2);
    });
  });
});
