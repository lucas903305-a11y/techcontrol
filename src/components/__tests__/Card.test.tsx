import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Card, CardHeader } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = render(<Card><Text>Content</Text></Card>);
    expect(getByText('Content')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Card onPress={onPress}><Text>Pressable</Text></Card>);
    fireEvent.press(getByText('Pressable'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders custom padding', () => {
    const { getByText } = render(<Card padding="xl"><Text>Padded</Text></Card>);
    expect(getByText('Padded')).toBeTruthy();
  });

  it('renders CardHeader with title', () => {
    const { getByText } = render(<CardHeader title="Header Title" />);
    expect(getByText('Header Title')).toBeTruthy();
  });

  it('renders CardHeader with subtitle', () => {
    const { getByText } = render(<CardHeader title="Title" subtitle="Subtitle" />);
    expect(getByText('Subtitle')).toBeTruthy();
  });
});
