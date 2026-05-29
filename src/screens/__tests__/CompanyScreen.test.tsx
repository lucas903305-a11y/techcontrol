import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CompanyScreen from '../CompanyScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: { updateProfile: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('@expo/vector-icons', () => require('../../../__jest_mocks__/expo-vector-icons'));

const mockStore = {
  user: { name: 'Test', company_name: 'Tech Solutions', email: 'test@test.com', id: '1', role: 'technician', plan: 'pro', created_at: '2024-01-01' },
  setUser: jest.fn(),
  showToast: jest.fn(),
  locale: 'es' as const,
  isDarkMode: false,
};

jest.mock('../../store', () => ({
  useAppStore: (selector: any) => (selector ? selector(mockStore) : mockStore),
}));

const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack };

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('CompanyScreen', () => {
  it('renders header Mi empresa', () => {
    const { getByText } = render(<CompanyScreen navigation={mockNavigation as any} />);
    expect(getByText('Mi empresa')).toBeTruthy();
  });

  it('renders input fields (company name, CUIT, fiscal address)', () => {
    const { getByDisplayValue } = render(<CompanyScreen navigation={mockNavigation as any} />);
    expect(getByDisplayValue('Tech Solutions')).toBeTruthy();
    expect(getByDisplayValue('30-12345678-9')).toBeTruthy();
    expect(getByDisplayValue('Av. Corrientes 1234')).toBeTruthy();
  });

  it('save button calls api.updateProfile', async () => {
    const { getByText } = render(<CompanyScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Guardar'));
    await waitFor(() => {
      expect(api.updateProfile).toHaveBeenCalledWith({ company_name: 'Tech Solutions' });
    });
  });

  it('shows success toast on save', async () => {
    const { getByText } = render(<CompanyScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Guardar'));
    await waitFor(() => {
      expect(mockStore.showToast).toHaveBeenCalledWith('Datos de empresa actualizados', 'success');
    });
  });

  it('back button navigates back', () => {
    const { getByText } = render(<CompanyScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('arrow-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
