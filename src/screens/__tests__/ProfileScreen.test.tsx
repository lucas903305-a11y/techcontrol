import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProfileScreen from '../ProfileScreen';
import { authService } from '../../services/auth';

jest.mock('../../services/auth', () => ({
  authService: { signOut: jest.fn() },
}));

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = { navigate: mockNavigate, replace: mockReplace, goBack: mockGoBack };

const menuItems = [
  { label: 'Perfil', screen: 'EditProfile' },
  { label: 'Mi empresa', screen: 'Company' },
  { label: 'Plan y facturación', screen: 'Billing' },
  { label: 'Notificaciones', screen: 'Notifications' },
  { label: 'Seguridad', screen: 'Security' },
  { label: 'Ayuda y soporte', screen: 'Help' },
  { label: 'Acerca de', screen: 'About' },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ProfileScreen', () => {
  it('renders header Perfil', () => {
    const { getAllByText } = render(<ProfileScreen navigation={mockNavigation as any} />);
    expect(getAllByText('Perfil').length).toBe(2);
  });

  it('renders all menu items', () => {
    const { getByLabelText } = render(<ProfileScreen navigation={mockNavigation as any} />);
    for (const item of menuItems) {
      expect(getByLabelText(item.label)).toBeTruthy();
    }
  });

  it('renders logout button', () => {
    const { getByText } = render(<ProfileScreen navigation={mockNavigation as any} />);
    expect(getByText('Cerrar sesión')).toBeTruthy();
  });

  it('each menu item navigates to correct screen', () => {
    const { getByLabelText } = render(<ProfileScreen navigation={mockNavigation as any} />);
    for (const item of menuItems) {
      fireEvent.press(getByLabelText(item.label));
      expect(mockNavigate).toHaveBeenCalledWith(item.screen);
    }
    expect(mockNavigate).toHaveBeenCalledTimes(menuItems.length);
  });
});
