import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import BillingScreen from '../BillingScreen';

jest.mock('@expo/vector-icons', () => require('../../../__jest_mocks__/expo-vector-icons'));

const mockStore = {
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

describe('BillingScreen', () => {
  it('renders header Plan y facturación', () => {
    const { getByText } = render(<BillingScreen navigation={mockNavigation as any} />);
    expect(getByText('Plan y facturación')).toBeTruthy();
  });

  it('renders current plan section with Plan actual and ACTIVO badge', () => {
    const { getByText } = render(<BillingScreen navigation={mockNavigation as any} />);
    expect(getByText('Plan actual')).toBeTruthy();
    expect(getByText('ACTIVO')).toBeTruthy();
  });

  it('renders available plans (Free and Pro)', () => {
    const { getByText, getAllByText } = render(<BillingScreen navigation={mockNavigation as any} />);
    expect(getByText('Free')).toBeTruthy();
    expect(getAllByText('Pro').length).toBeGreaterThanOrEqual(2);
    expect(getByText('Enterprise')).toBeTruthy();
  });

  it('pressing Cambiar plan on a different plan shows Alert confirmation', () => {
    const { getByText } = render(<BillingScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Free'));
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('confirms plan change', () => {
    const { getByText } = render(<BillingScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('Free'));
    const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertArgs[2];
    const cambiarButton = buttons.find((b: any) => b.text === 'Cambiar');
    act(() => {
      cambiarButton.onPress();
    });
    expect(mockStore.showToast).toHaveBeenCalledWith('Plan activado Free', 'success');
  });
});
