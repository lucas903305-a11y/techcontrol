import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';
import ReportsScreen from '../ReportsScreen';
import { api } from '../../services/api';

const mockStore = {
  user: { id: '1', name: 'Test', email: 'test@test.com', role: 'technician' as const, plan: 'pro' as const, created_at: '' },
  isDarkMode: false,
  locale: 'es' as const,
  showToast: jest.fn(),
  setLocale: jest.fn(),
  setUser: jest.fn(),
};
jest.mock('../../store', () => ({
  useAppStore: (selector: any) => (selector ? selector(mockStore) : mockStore),
}));

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
  { id: '1', user_id: '1', client_id: '1', client_name: 'Cliente A', title: 'Instalación', status: 'completed', priority: 'high', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: '1', client_id: '2', client_name: 'Cliente B', title: 'Mantenimiento', status: 'pending', priority: 'urgent', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', user_id: '1', client_id: '3', client_name: 'Cliente C', title: 'Reparación', status: 'in_progress', priority: 'medium', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: mockGoBack };

beforeEach(() => {
  jest.clearAllMocks();
  (api.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
  (api.getTickets as jest.Mock).mockResolvedValue(mockTickets);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ReportsScreen', () => {
  it('renders header "Reportes"', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Reportes')).toBeTruthy();
  });

  it('renders earnings summary', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Ganancias del mes')).toBeTruthy();
  });

  it('renders stat boxes with labels', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Abiertos')).toBeTruthy();
    expect(await findByText('Hoy')).toBeTruthy();
    expect(await findByText('Clientes')).toBeTruthy();
  });

  it('renders stat box values after loading', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    expect(await findByText('3')).toBeTruthy();
    expect(await findByText('5')).toBeTruthy();
    expect(await findByText('12')).toBeTruthy();
  });

  it('renders completed rate in summary', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    expect(await findByText('33% completado')).toBeTruthy();
  });

  it('renders all report cards with labels', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Tickets resueltos')).toBeTruthy();
    expect(await findByText('Pendientes')).toBeTruthy();
    expect(await findByText('En progreso')).toBeTruthy();
    expect(await findByText('Historial mensual')).toBeTruthy();
    expect(await findByText('Clientes activos')).toBeTruthy();
    expect(await findByText('Exportar datos')).toBeTruthy();
  });

  it('renders report card descriptions', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    expect(await findByText('1 de 3 (33%)')).toBeTruthy();
    expect(await findByText('1 sin asignar')).toBeTruthy();
    expect(await findByText('1 en curso')).toBeTruthy();
    expect(await findByText('Comparativa mensual')).toBeTruthy();
    expect(await findByText('12 registrados')).toBeTruthy();
    expect(await findByText('Excel o PDF')).toBeTruthy();
  });

  it('shows toast when report card is pressed', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Tickets resueltos'));
    expect(mockStore.showToast).toHaveBeenCalledWith('1 tickets completados', 'success');
  });

  it('shows toast for pending card', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Pendientes'));
    expect(mockStore.showToast).toHaveBeenCalledWith('1 tickets pendientes', 'info');
  });

  it('shows toast for in-progress card', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('En progreso'));
    expect(mockStore.showToast).toHaveBeenCalledWith('1 en progreso', 'info');
  });

  it('shows toast for monthly history card', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Historial mensual'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Historial mensual — próximamente', 'info');
  });

  it('shows toast for active clients card', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Clientes activos'));
    expect(mockStore.showToast).toHaveBeenCalledWith('12 clientes activos', 'success');
  });

  it('shows toast for export card', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Exportar datos'));
    expect(mockStore.showToast).toHaveBeenCalledWith('Exportar — próximamente', 'info');
  });

  it('pull-to-refresh reloads data', async () => {
    const { UNSAFE_getByType, findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    await findByText('3');
    expect(api.getDashboardStats).toHaveBeenCalledTimes(1);
    expect(api.getTickets).toHaveBeenCalledTimes(1);
    const refreshControl = UNSAFE_getByType(RefreshControl);
    act(() => { refreshControl.props.onRefresh(); });
    await waitFor(() => {
      expect(api.getDashboardStats).toHaveBeenCalledTimes(2);
      expect(api.getTickets).toHaveBeenCalledTimes(2);
    });
  });

  it('navigates back on back button press', async () => {
    const { findByText } = render(<ReportsScreen navigation={mockNavigation as any} />);
    const backButton = await findByText('');
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});
