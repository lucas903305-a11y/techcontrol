import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NewInventoryScreen from '../NewInventoryScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    createInventoryItem: jest.fn(),
    updateInventoryItem: jest.fn(),
    deleteInventoryItem: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: mockGoBack };

const mockExistingItem = {
  id: '1',
  user_id: '1',
  name: 'Cable UTP CAT6',
  quantity: 50,
  min_stock: 10,
  unit: 'metros',
  price: 250,
  category: 'cables',
  created_at: '2024-01-01',
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NewInventoryScreen', () => {
  it('renders "Nuevo producto" header in create mode', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(getByText('Nuevo producto')).toBeTruthy();
  });

  it('renders "Editar producto" header in edit mode', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} route={{ params: { item: mockExistingItem } }} />);
    expect(getByText('Editar producto')).toBeTruthy();
  });

  it('renders name input field', () => {
    const { getByPlaceholderText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('Ej: Cable UTP CAT6')).toBeTruthy();
  });

  it('renders quantity input field', () => {
    const { getByDisplayValue } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(getByDisplayValue('1')).toBeTruthy();
  });

  it('renders min stock input field', () => {
    const { getByDisplayValue } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(getByDisplayValue('5')).toBeTruthy();
  });

  it('renders unit input field', () => {
    const { getByDisplayValue } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(getByDisplayValue('unidad')).toBeTruthy();
  });

  it('renders price input field', () => {
    const { getByPlaceholderText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    const priceInput = getByPlaceholderText('0');
    expect(priceInput).toBeTruthy();
  });

  it('renders category chips', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(getByText('Cables')).toBeTruthy();
    expect(getByText('Conectores')).toBeTruthy();
    expect(getByText('Cámaras')).toBeTruthy();
    expect(getByText('Accesorios')).toBeTruthy();
  });

  it('renders save button in create mode', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(getByText('Guardar producto')).toBeTruthy();
  });

  it('save button validates required fields', async () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    await act(async () => {
      fireEvent.press(getByText('Guardar producto'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'El nombre es obligatorio');
  });

  it('save button calls api.createInventoryItem', async () => {
    (api.createInventoryItem as jest.Mock).mockResolvedValueOnce({ id: 'new-id' });
    const { getByText, getByPlaceholderText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByPlaceholderText('Ej: Cable UTP CAT6'), 'Nuevo Cable');
    await act(async () => {
      fireEvent.press(getByText('Guardar producto'));
    });
    expect(api.createInventoryItem).toHaveBeenCalledWith(expect.objectContaining({ name: 'Nuevo Cable' }));
  });

  it('edit mode loads existing data', () => {
    const { getByDisplayValue } = render(<NewInventoryScreen navigation={mockNavigation as any} route={{ params: { item: mockExistingItem } }} />);
    expect(getByDisplayValue('Cable UTP CAT6')).toBeTruthy();
    expect(getByDisplayValue('50')).toBeTruthy();
    expect(getByDisplayValue('10')).toBeTruthy();
    expect(getByDisplayValue('metros')).toBeTruthy();
  });

  it('edit mode renders update button', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} route={{ params: { item: mockExistingItem } }} />);
    expect(getByText('Actualizar producto')).toBeTruthy();
  });

  it('edit mode calls api.updateInventoryItem on save', async () => {
    (api.updateInventoryItem as jest.Mock).mockResolvedValueOnce(undefined);
    const { getByText, getByDisplayValue } = render(<NewInventoryScreen navigation={mockNavigation as any} route={{ params: { item: mockExistingItem } }} />);
    fireEvent.changeText(getByDisplayValue('Cable UTP CAT6'), 'Cable UTP CAT6 Actualizado');
    await act(async () => {
      fireEvent.press(getByText('Actualizar producto'));
    });
    expect(api.updateInventoryItem).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'Cable UTP CAT6 Actualizado' }));
  });

  it('edit mode renders delete button', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} route={{ params: { item: mockExistingItem } }} />);
    expect(getByText('Eliminar producto')).toBeTruthy();
  });

  it('delete button shows confirmation in edit mode', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} route={{ params: { item: mockExistingItem } }} />);
    fireEvent.press(getByText('Eliminar producto'));
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('close button navigates back', () => {
    const { UNSAFE_root } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    const closeIcon = UNSAFE_root.findByProps({ name: 'close' });
    fireEvent.press(closeIcon);
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('category chip selection works', () => {
    const { getByText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Cables'));
    const cablesChip = getByText('Cables');
    expect(cablesChip).toBeTruthy();
  });

  it('does not render delete button in create mode', () => {
    const { queryByText } = render(<NewInventoryScreen navigation={mockNavigation as any} />);
    expect(queryByText('Eliminar producto')).toBeNull();
  });
});
