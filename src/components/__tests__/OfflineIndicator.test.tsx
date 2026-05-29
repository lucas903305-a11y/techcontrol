import React from 'react';
import { render } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import { OfflineIndicator } from '../OfflineIndicator';

jest.mock('../../store', () => ({
  useAppStore: (selector?: any) => {
    const state = { locale: 'es' as const, isDarkMode: false };
    return selector ? selector(state) : state;
  },
}));

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => {
    const { Colors } = jest.requireActual('../../theme/colors');
    return { colors: Colors.light, isDark: false };
  },
}));

describe('OfflineIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when online', () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: any) => {
      cb({ isConnected: true, isInternetReachable: true });
      return jest.fn();
    });
    const { queryByText } = render(<OfflineIndicator />);
    expect(queryByText('Sin conexión a internet')).toBeNull();
  });

  it('renders banner when offline', () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: any) => {
      cb({ isConnected: false, isInternetReachable: false });
      return jest.fn();
    });
    const { getByText } = render(<OfflineIndicator />);
    expect(getByText('Sin conexión a internet')).toBeTruthy();
  });

  it('banner shows translated text', () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: any) => {
      cb({ isConnected: false, isInternetReachable: false });
      return jest.fn();
    });
    const { getByText } = render(<OfflineIndicator />);
    expect(getByText(/Sin conexión/i)).toBeTruthy();
  });

  it('banner uses error background color', () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: any) => {
      cb({ isConnected: false, isInternetReachable: false });
      return jest.fn();
    });
    const { Colors } = jest.requireActual('../../theme/colors');
    const rendered = render(<OfflineIndicator />);
    const json = rendered.toJSON();
    expect(json).toBeTruthy();
    const styleArr = Array.isArray((json as any).props.style)
      ? (json as any).props.style
      : [(json as any).props.style];
    expect(styleArr).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: Colors.light.error }),
      ])
    );
  });
});
