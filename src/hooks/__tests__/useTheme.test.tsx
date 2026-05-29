import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { useTheme } from '../useTheme';
import { useAppStore } from '../../store';

function ThemeConsumer({ onRender }: { onRender: (theme: ReturnType<typeof useTheme>) => void }) {
  const theme = useTheme();
  React.useEffect(() => { onRender(theme); }, [theme, onRender]);
  return <View />;
}

describe('useTheme', () => {
  beforeEach(() => {
    useAppStore.setState({ isDarkMode: false });
  });

  it('returns light colors by default', () => {
    const spy = jest.fn();
    render(<ThemeConsumer onRender={spy} />);
    const { colors, isDark } = spy.mock.calls[0][0];
    expect(isDark).toBe(false);
    expect(colors.background).toBe('#F8FAFC');
    expect(colors.text).toBe('#0F172A');
  });

  it('returns dark colors when dark mode is on', () => {
    useAppStore.setState({ isDarkMode: true });
    const spy = jest.fn();
    render(<ThemeConsumer onRender={spy} />);
    const { colors, isDark } = spy.mock.calls[0][0];
    expect(isDark).toBe(true);
    expect(colors.background).toBe('#0A0F1E');
    expect(colors.text).toBe('#F1F5F9');
  });
});
