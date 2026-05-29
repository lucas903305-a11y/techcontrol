import React from 'react';
import { render } from '@testing-library/react-native';
import PlaceholderScreen from '../PlaceholderScreen';

jest.mock('../../store', () => {
  const data = {
    user: { name: 'Test User', email: 'test@test.com' },
    isDarkMode: false,
    locale: 'es' as const,
    setLocale: jest.fn(),
  };
  return {
    useAppStore: (selector: any) => (selector ? selector(data) : data),
  };
});

const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack };

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PlaceholderScreen', () => {
  it('renders "En desarrollo" title', () => {
    const { getByText } = render(<PlaceholderScreen navigation={mockNavigation as any} />);
    expect(getByText('En desarrollo')).toBeTruthy();
  });

  it('renders "Próximamente" subtitle', () => {
    const { getByText } = render(<PlaceholderScreen navigation={mockNavigation as any} />);
    expect(getByText('Próximamente')).toBeTruthy();
  });

  it('renders description text', () => {
    const { getByText } = render(<PlaceholderScreen navigation={mockNavigation as any} />);
    expect(getByText('Esta pantalla está en desarrollo')).toBeTruthy();
  });
});
