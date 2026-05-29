import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('renders label when provided', () => {
    const { getByText } = render(<Input label="Email" value="" onChangeText={() => {}} />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('calls onChangeText', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(<Input placeholder="Type here" value="" onChangeText={onChange} />);
    fireEvent.changeText(getByPlaceholderText('Type here'), 'new value');
    expect(onChange).toHaveBeenCalledWith('new value');
  });

  it('renders with initial value', () => {
    const { getByDisplayValue } = render(<Input value="initial" onChangeText={() => {}} />);
    expect(getByDisplayValue('initial')).toBeTruthy();
  });
});
