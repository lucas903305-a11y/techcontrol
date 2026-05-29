import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('renders initials for name', () => {
    const { getByText } = render(<Avatar name="John Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('renders fallback when no name', () => {
    const { getByText } = render(<Avatar />);
    expect(getByText('?')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Avatar name="Test" onPress={onPress} />);
    fireEvent.press(getByText('T'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders custom size', () => {
    const { getByText } = render(<Avatar name="A" size={60} />);
    expect(getByText('A')).toBeTruthy();
  });
});
