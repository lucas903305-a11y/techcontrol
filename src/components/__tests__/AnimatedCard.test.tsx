import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { AnimatedCard } from '../AnimatedCard';

describe('AnimatedCard', () => {
  it('renders children', () => {
    const { getByText } = render(<AnimatedCard><Text>Content</Text></AnimatedCard>);
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders with custom index', () => {
    const { getByText } = render(<AnimatedCard index={3}><Text>Delayed</Text></AnimatedCard>);
    expect(getByText('Delayed')).toBeTruthy();
  });

  it('renders with direction up', () => {
    const { getByText } = render(<AnimatedCard direction="up"><Text>Up</Text></AnimatedCard>);
    expect(getByText('Up')).toBeTruthy();
  });
});
