import React from 'react';
import { render, act } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';

const mockStore = {
  locale: 'es' as const,
  setLocale: jest.fn(),
};
jest.mock('../../store', () => ({
  useAppStore: (selector: any) => (selector ? selector(mockStore) : mockStore),
}));

const mockReplace = jest.fn();
const mockNavigation = { replace: mockReplace };

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('SplashScreen', () => {
  it('renders app name "TechControl"', () => {
    const { getByText } = render(<SplashScreen navigation={mockNavigation as any} />);
    expect(getByText(/TechControl/)).toBeTruthy();
  });

  it('renders subtitle', () => {
    const { getByText } = render(<SplashScreen navigation={mockNavigation as any} />);
    expect(getByText('Gestión inteligente para técnicos IT')).toBeTruthy();
  });

  it('renders version text', () => {
    const { getByText } = render(<SplashScreen navigation={mockNavigation as any} />);
    expect(getByText('v1.0.0')).toBeTruthy();
  });

  it('automatically navigates to Login after timeout', () => {
    jest.useFakeTimers();
    render(<SplashScreen navigation={mockNavigation as any} />);
    act(() => { jest.advanceTimersByTime(2500); });
    expect(mockReplace).toHaveBeenCalledWith('Login');
  });
});
