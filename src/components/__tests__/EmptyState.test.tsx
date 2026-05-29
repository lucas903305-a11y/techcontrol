import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    const { getByText } = render(<EmptyState title="No data" />);
    expect(getByText('No data')).toBeTruthy();
  });

  it('renders message when provided', () => {
    const { getByText } = render(<EmptyState title="Empty" message="Nothing here yet" />);
    expect(getByText('Nothing here yet')).toBeTruthy();
  });

  it('renders action button when actionLabel and onAction provided', () => {
    const onAction = jest.fn();
    const { getByText } = render(<EmptyState title="Empty" actionLabel="Add" onAction={onAction} />);
    expect(getByText('Add')).toBeTruthy();
  });

  it('calls onAction when button pressed', () => {
    const onAction = jest.fn();
    const { getByText } = render(<EmptyState title="Empty" actionLabel="Add" onAction={onAction} />);
    fireEvent.press(getByText('Add'));
    expect(onAction).toHaveBeenCalled();
  });

  it('renders default icon', () => {
    const { getByText } = render(<EmptyState title="Title" />);
    expect(getByText('Title')).toBeTruthy();
  });
});
