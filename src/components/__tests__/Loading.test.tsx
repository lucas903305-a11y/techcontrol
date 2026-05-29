import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from '../Loading';

describe('Loading', () => {
  it('renders spinner', () => {
    const { root } = render(<Loading />);
    expect(root).toBeTruthy();
  });

  it('renders message when provided', () => {
    const { getByText } = render(<Loading message="Cargando..." />);
    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('renders without message', () => {
    const { queryByText } = render(<Loading />);
    expect(queryByText('Cargando...')).toBeNull();
  });

  it('renders in fullScreen mode', () => {
    const { getByText } = render(<Loading message="Full" fullScreen />);
    expect(getByText('Full')).toBeTruthy();
  });
});
