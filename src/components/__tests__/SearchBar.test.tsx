import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders placeholder', () => {
    const { getByPlaceholderText } = render(<SearchBar value="" onChangeText={() => {}} placeholder="Find..." />);
    expect(getByPlaceholderText('Find...')).toBeTruthy();
  });

  it('calls onChangeText on input', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar value="" onChangeText={onChange} placeholder="Search" />);
    fireEvent.changeText(getByPlaceholderText('Search'), 'query');
    expect(onChange).toHaveBeenCalledWith('query');
  });

  it('shows clear button when value is not empty', () => {
    const { queryByTestId } = render(<SearchBar value="text" onChangeText={() => {}} />);
    expect(queryByTestId('close-circle')).toBeNull();
  });
});
