import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ClientsScreen from '../ClientsScreen';
import { api } from '../../services/api';

jest.mock('../../store', () => {
  const data = {
    user: { name: 'Test User' },
    isDarkMode: false,
    locale: 'es',
    setLocale: jest.fn(),
  };
  return {
    useAppStore: (selector: any) => (selector ? selector(data) : data),
  };
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb: any) => cb()),
}));

jest.mock('../../services/api', () => ({
  api: {
    getClients: jest.fn(),
  },
}));

const mockClients = [
  { id: '1', user_id: '1', name: 'Edificio Torres', phone: '+54 11 4555-1234', address: 'Av. Corrientes 1234', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: '1', name: 'Tech Solutions SA', phone: '+54 11 4777-5678', address: 'Calle Florida 567', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', user_id: '1', name: 'Oficinas Norte', phone: '+54 11 4888-9012', address: 'Av. Cabildo 3421', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: mockGoBack };

beforeEach(() => {
  jest.clearAllMocks();
  (api.getClients as jest.Mock).mockResolvedValue(mockClients);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ClientsScreen', () => {
  it('renders header with title', async () => {
    const { findByText } = render(<ClientsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Clientes')).toBeTruthy();
  });

  it('renders search bar with placeholder', () => {
    const { getByPlaceholderText } = render(<ClientsScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('Buscar...')).toBeTruthy();
  });

  it('renders clients list when data is loaded', async () => {
    const { findByText } = render(<ClientsScreen navigation={mockNavigation as any} />);
    expect(await findByText('Edificio Torres')).toBeTruthy();
    expect(await findByText('Tech Solutions SA')).toBeTruthy();
    expect(await findByText('Oficinas Norte')).toBeTruthy();
    expect(await findByText('+54 11 4555-1234')).toBeTruthy();
  });

  it('shows empty state when no clients', async () => {
    (api.getClients as jest.Mock).mockResolvedValueOnce([]);
    const { findByText } = render(<ClientsScreen navigation={mockNavigation as any} />);
    expect(await findByText('No hay clientes aún')).toBeTruthy();
  });

  it('filters clients by search', async () => {
    const { findByPlaceholderText, getByText, queryByText } = render(<ClientsScreen navigation={mockNavigation as any} />);
    const searchInput = await findByPlaceholderText('Buscar...');
    fireEvent.changeText(searchInput, 'Torres');
    expect(getByText('Edificio Torres')).toBeTruthy();
    expect(queryByText('Tech Solutions SA')).toBeNull();
  });

  it('FAB navigates to NewClient', async () => {
    const { UNSAFE_root } = render(<ClientsScreen navigation={mockNavigation as any} />);
    const addIcon = UNSAFE_root.findByProps({ name: 'add-circle' });
    fireEvent.press(addIcon);
    expect(mockNavigate).toHaveBeenCalledWith('NewClient');
  });

  it('client card navigates to detail on press', async () => {
    const { findByText } = render(<ClientsScreen navigation={mockNavigation as any} />);
    fireEvent.press(await findByText('Edificio Torres'));
    expect(mockNavigate).toHaveBeenCalledWith('ClientDetail', { client: expect.objectContaining({ name: 'Edificio Torres' }) });
  });
});
