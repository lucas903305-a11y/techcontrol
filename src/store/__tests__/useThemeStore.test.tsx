import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { useThemeStore } from '../useThemeStore';
import { useAppStore } from '../useAppStore';

function ThemeConsumer({ onRender }: { onRender: (state: ReturnType<typeof useThemeStore>) => void }) {
  const state = useThemeStore();
  React.useEffect(() => { onRender(state); }, [state, onRender]);
  return <View />;
}

describe('useThemeStore', () => {
  beforeEach(() => {
    useAppStore.setState({ isDarkMode: false });
  });

  it('returns isDark=false by default', () => {
    const spy = jest.fn();
    render(<ThemeConsumer onRender={spy} />);
    expect(spy.mock.calls[0][0].isDark).toBe(false);
  });

  it('toggles dark mode', () => {
    const spy = jest.fn();
    render(<ThemeConsumer onRender={spy} />);
    const { toggle } = spy.mock.calls[0][0];
    toggle();
    expect(useAppStore.getState().isDarkMode).toBe(true);
    toggle();
    expect(useAppStore.getState().isDarkMode).toBe(false);
  });

  it('sets dark mode directly', () => {
    const spy = jest.fn();
    render(<ThemeConsumer onRender={spy} />);
    const { setDark } = spy.mock.calls[0][0];
    setDark(true);
    expect(useAppStore.getState().isDarkMode).toBe(true);
    setDark(false);
    expect(useAppStore.getState().isDarkMode).toBe(false);
  });
});
