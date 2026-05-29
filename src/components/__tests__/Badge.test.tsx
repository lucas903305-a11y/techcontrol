import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders label', () => {
    const { getByText } = render(<Badge label="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('applies variant styles', () => {
    const { getByText } = render(<Badge label="Error" variant="error" />);
    expect(getByText('Error')).toBeTruthy();
  });

  it('handles size prop', () => {
    const { getByText } = render(<Badge label="Small" size="sm" />);
    expect(getByText('Small')).toBeTruthy();
  });
});
