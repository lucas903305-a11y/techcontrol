import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import InventoryScreen from '../InventoryScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    getInventory: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb) => cb()),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const mockItems = [
  { id: '1', user_id: '1', name: 'Cable UTP CAT6', quantity: 50, min_stock: 10, unit: 'metros', price: 250, category: 'cables', created_at: '2024-01-01' },
  { id: '2', user_id: '1', name: 'Conector RJ45', quantity: 100, min_stock: 20, unit: 'unidad', price: 50, category: 'conectores', created_at: '2024-01-01' },
  { id: '3', user_id: '1', name: 'Cámara Dahua 2MP', quantity: 3, min_stock: 5, unit: 'unidad', price: 15000, category: 'cámaras', created_at: '2024-01-01' },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('InventoryScreen', () => {
  it('renders header "Inventario"', () => {
    (api.getInventory as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<InventoryScreen navigation={mockNavigation as any} />);
    expect(getByText('Inventario')).toBeTruthy();
  });

  it('renders search bar', () => {
    (api.getInventory as jest.Mock).mockResolvedValue([]);
    const { getByPlaceholderText } = render(<InventoryScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('Buscar producto...')).toBeTruthy();
  });

  it('renders "Stock bajo" filter button', async () => {
    (api.getInventory as jest.Mock).mockResolvedValue(mockItems);
    const { getByText } = render(<InventoryScreen navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText(/Stock bajo/)).toBeTruthy();
    });
  });

  it('shows inventory list items', async () => {
    (api.getInventory as jest.Mock).mockResolvedValue(mockItems);
    const { getByText } = render(<InventoryScreen navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText('Cable UTP CAT6')).toBeTruthy();
      expect(getByText('Conector RJ45')).toBeTruthy();
      expect(getByText('Cámara Dahua 2MP')).toBeTruthy();
    });
  });

  it('shows "Inventario vacío" when no items', async () => {
    (api.getInventory as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<InventoryScreen navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText('Inventario vacío')).toBeTruthy();
    });
  });

  it('FAB navigates to NewInventory', async () => {
    (api.getInventory as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<InventoryScreen navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText('Inventario vacío')).toBeTruthy();
    });
    fireEvent.press(getByText('Agregar producto'));
    expect(mockNavigate).toHaveBeenCalledWith('NewInventory');
  });

  it('search filters items', async () => {
    (api.getInventory as jest.Mock).mockResolvedValue(mockItems);
    const { getByPlaceholderText, getByText, queryByText } = render(<InventoryScreen navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText('Cable UTP CAT6')).toBeTruthy();
      expect(getByText('Conector RJ45')).toBeTruthy();
    });
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Buscar producto...'), 'Cable');
    });
    expect(getByText('Cable UTP CAT6')).toBeTruthy();
    expect(queryByText('Conector RJ45')).toBeNull();
    expect(queryByText('Cámara Dahua 2MP')).toBeNull();
  });
});
