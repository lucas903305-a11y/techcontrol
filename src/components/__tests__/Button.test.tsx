import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders title', () => {
    const { getByText } = render(<Button title="Test" onPress={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press" onPress={onPress} />);
    fireEvent.press(getByText('Press'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders when loading', () => {
    const { queryByText } = render(<Button title="Load" onPress={() => {}} loading />);
    expect(queryByText('Load')).toBeNull();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { root } = render(<Button title="Disabled" onPress={onPress} loading />);
    fireEvent.press(root);
    expect(onPress).not.toHaveBeenCalled();
  });
});
