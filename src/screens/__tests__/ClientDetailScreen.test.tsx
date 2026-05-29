import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ClientDetailScreen from '../ClientDetailScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    getEquipment: jest.fn(),
    getVisits: jest.fn(),
    deleteClient: jest.fn(),
    createEquipment: jest.fn(),
    deleteEquipment: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((cb: any) => cb()),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: -34.6037, longitude: -58.3816 } })),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { navigate: mockNavigate, goBack: mockGoBack };

const mockClient = {
  id: '1',
  user_id: '1',
  name: 'Edificio Torres',
  phone: '+54 11 4555-1234',
  email: 'torres@example.com',
  address: 'Av. Corrientes 1234',
  notes: 'Cliente corporativo',
  lat: -34.6037,
  lng: -58.3816,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockEquipment = [
  { id: 'e1', client_id: '1', name: 'Cámara Dahua', brand: 'Dahua', model: 'DH-IPC', serial_number: 'SN123', warranty_end: '2026-06-15' },
];

const mockVisits = [
  { id: 'v1', client_id: '1', user_id: '1', lat: -34.6037, lng: -58.3816, address: 'Av. Corrientes 1234', check_in: '2024-06-01T10:00:00Z', check_out: '2024-06-01T12:30:00Z', notes: 'Instalación completada' },
];

const mockRoute = { params: { client: mockClient } };

beforeEach(() => {
  jest.clearAllMocks();
  (api.getEquipment as jest.Mock).mockResolvedValue(mockEquipment);
  (api.getVisits as jest.Mock).mockResolvedValue(mockVisits);
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ClientDetailScreen', () => {
  it('renders client name', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Edificio Torres')).toBeTruthy();
  });

  it('renders client phone in info section', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('+54 11 4555-1234')).toBeTruthy();
  });

  it('renders client email', async () => {
    const { getAllByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    const emails = await getAllByText('torres@example.com');
    expect(emails.length).toBeGreaterThanOrEqual(1);
  });

  it('renders client address', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Av. Corrientes 1234')).toBeTruthy();
  });

  it('renders client notes', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Cliente corporativo')).toBeTruthy();
  });

  it('renders action buttons', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Llamar')).toBeTruthy();
    expect(await findByText('WhatsApp')).toBeTruthy();
  });

  it('renders equipment section title', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Equipos instalados')).toBeTruthy();
  });

  it('renders equipment data', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Cámara Dahua')).toBeTruthy();
  });

  it('renders visits section title', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Visitas')).toBeTruthy();
  });

  it('renders visit notes', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Instalación completada')).toBeTruthy();
  });

  it('back button navigates back', async () => {
    const { UNSAFE_root } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    const allBack = UNSAFE_root.findAllByProps({ name: 'arrow-back' });
    const backButtons = await allBack;
    if (backButtons.length > 0) {
      fireEvent.press(backButtons[0]);
    }
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('delete client button shows confirmation', async () => {
    const { UNSAFE_root } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    const allTrash = UNSAFE_root.findAllByProps({ name: 'trash-outline' });
    const trashButtons = await allTrash;
    if (trashButtons.length > 0) {
      fireEvent.press(trashButtons[0]);
    }
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('edit button navigates to NewClient', async () => {
    const { UNSAFE_root } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    const allPencil = UNSAFE_root.findAllByProps({ name: 'pencil-outline' });
    const editButtons = await allPencil;
    if (editButtons.length > 0) {
      fireEvent.press(editButtons[0]);
    }
    expect(mockNavigate).toHaveBeenCalledWith('NewClient', { client: mockClient });
  });

  it('renders serial number in equipment detail', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText(/SN: SN123/)).toBeTruthy();
  });

  it('renders start visit button', async () => {
    const { findByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    expect(await findByText('Iniciar visita')).toBeTruthy();
  });

  it('renders header and section title', async () => {
    const { getAllByText } = render(<ClientDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    const titles = await getAllByText('Detalle del cliente');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });
});
