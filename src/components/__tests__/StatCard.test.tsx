import React from 'react';
import { render } from '@testing-library/react-native';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renders title and value', () => {
    const { getByText } = render(<StatCard title="Tickets" value="42" icon="ticket" />);
    expect(getByText('Tickets')).toBeTruthy();
    expect(getByText('42')).toBeTruthy();
  });

  it('renders numeric value', () => {
    const { getByText } = render(<StatCard title="Count" value={100} icon="code-slash" />);
    expect(getByText('100')).toBeTruthy();
  });

  it('shows loading indicator', () => {
    const { queryByText } = render(<StatCard title="Loading" value="0" icon="time" loading />);
    expect(queryByText('0')).toBeNull();
  });

  it('renders with custom color', () => {
    const { getByText } = render(<StatCard title="Custom" value="X" icon="star" color="#FF0000" />);
    expect(getByText('X')).toBeTruthy();
  });
});
