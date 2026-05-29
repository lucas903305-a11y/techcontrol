import React from 'react';
import { render } from '@testing-library/react-native';
import { AnimatedTabIcon } from '../AnimatedTabIcon';

jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated'));

jest.mock('@expo/vector-icons', () => {
  const React = jest.requireActual('react');
  const { Text } = jest.requireActual('react-native');
  return {
    Ionicons: (props: any) => React.createElement(Text, { testID: 'mock-ionicon', ...props }, props.name),
  };
});

describe('AnimatedTabIcon', () => {
  it('renders the correct Ionicons icon name', () => {
    const { getByText } = render(
      <AnimatedTabIcon name="home" size={24} color="#000" focused={false} />
    );
    expect(getByText('home')).toBeTruthy();
  });

  it('renders when focused', () => {
    const { getByText } = render(
      <AnimatedTabIcon name="home" size={24} color="#000" focused={true} />
    );
    expect(getByText('home')).toBeTruthy();
  });

  it('renders when not focused', () => {
    const { getByText } = render(
      <AnimatedTabIcon name="home" size={24} color="#000" focused={false} />
    );
    expect(getByText('home')).toBeTruthy();
  });

  it('icon color is applied correctly', () => {
    const { getByText } = render(
      <AnimatedTabIcon name="home" size={24} color="#FF0000" focused={false} />
    );
    const icon = getByText('home');
    expect(icon.props.color).toBe('#FF0000');
  });
});
