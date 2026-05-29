import React from 'react';
import { render } from '@testing-library/react-native';
import { Toast } from '../Toast';

describe('Toast', () => {
  it('renders nothing when not visible', () => {
    const { queryByText } = render(<Toast visible={false} message="Hello" />);
    expect(queryByText('Hello')).toBeNull();
  });

  it('renders message when visible', () => {
    const { getByText } = render(<Toast visible={true} message="Hello" />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('renders success type', () => {
    const { getByText } = render(<Toast visible={true} message="OK" type="success" />);
    expect(getByText('OK')).toBeTruthy();
  });

  it('renders with error type', () => {
    const { getByText } = render(<Toast visible={true} message="Error" type="error" />);
    expect(getByText('Error')).toBeTruthy();
  });

  it('renders with warning type', () => {
    const { getByText } = render(<Toast visible={true} message="Warn" type="warning" />);
    expect(getByText('Warn')).toBeTruthy();
  });
});
