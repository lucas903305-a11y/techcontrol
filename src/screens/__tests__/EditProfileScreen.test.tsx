import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import EditProfileScreen from '../EditProfileScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: { updateProfile: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@expo/vector-icons', () => require('../../../__jest_mocks__/expo-vector-icons'));

const mockStore = {
  user: { name: 'Juan Pérez', email: 'juan@test.com', phone: '+54 11 2345-6789', company_name: 'TechCo', photo_url: '', id: '1', role: 'technician', plan: 'pro', created_at: '2024-01-01' },
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
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('EditProfileScreen', () => {
  it('renders header Mi perfil', () => {
    const { getByText } = render(<EditProfileScreen navigation={mockNavigation as any} />);
    expect(getByText('Mi perfil')).toBeTruthy();
  });

  it('renders input fields (name, phone, company)', () => {
    const { getByDisplayValue } = render(<EditProfileScreen navigation={mockNavigation as any} />);
    expect(getByDisplayValue('Juan Pérez')).toBeTruthy();
    expect(getByDisplayValue('+54 11 2345-6789')).toBeTruthy();
    expect(getByDisplayValue('TechCo')).toBeTruthy();
  });

  it('renders Tocá para cambiar foto text', () => {
    const { getByText } = render(<EditProfileScreen navigation={mockNavigation as any} />);
    expect(getByText('Tocá para cambiar foto')).toBeTruthy();
  });

  it('save button validates required fields', () => {
    const { getByText, getByDisplayValue } = render(<EditProfileScreen navigation={mockNavigation as any} />);
    fireEvent.changeText(getByDisplayValue('Juan Pérez'), '');
    fireEvent.press(getByText('Guardar'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'El nombre es obligatorio');
  });

  it('save button updates profile', async () => {
    const { getByText } = render(<EditProfileScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Guardar'));
    await waitFor(() => {
      expect(api.updateProfile).toHaveBeenCalled();
    });
    expect(mockStore.setUser).toHaveBeenCalled();
    expect(mockStore.showToast).toHaveBeenCalledWith('Perfil actualizado', 'success');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('back button navigates back', () => {
    const { getByText } = render(<EditProfileScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('arrow-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
