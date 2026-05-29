import React from 'react';
import { render } from '@testing-library/react-native';
import { FloatingActionButton } from '../FloatingActionButton';

describe('FloatingActionButton', () => {
  it('renders default icon', () => {
    const onPress = jest.fn();
    const { root } = render(<FloatingActionButton onPress={onPress} />);
    expect(root).toBeTruthy();
  });

  it('renders with custom color', () => {
    const onPress = jest.fn();
    const { root } = render(<FloatingActionButton onPress={onPress} color="#FF0000" />);
    expect(root).toBeTruthy();
  });
});
