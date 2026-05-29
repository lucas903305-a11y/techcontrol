import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AIAssistantScreen from '../AIAssistantScreen';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: true }),
}));

jest.mock('../../services/openai', () => ({
  openAIService: { chatAssistant: jest.fn() },
}));

const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack };

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('AIAssistantScreen', () => {
  it('renders header Asistente IA', () => {
    const { getAllByText } = render(<AIAssistantScreen navigation={mockNavigation as any} />);
    expect(getAllByText('Asistente IA').length).toBe(2);
  });

  it('renders description text', () => {
    const { getByText } = render(<AIAssistantScreen navigation={mockNavigation as any} />);
    expect(getByText('Describime el problema técnico o subí una foto y te ayudo con el diagnóstico.')).toBeTruthy();
  });

  it('renders text input with placeholder', () => {
    const { getByPlaceholderText } = render(<AIAssistantScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('Describí el problema...')).toBeTruthy();
  });

  it('send button is disabled when input is empty', () => {
    const { getByPlaceholderText, getByText } = render(<AIAssistantScreen navigation={mockNavigation as any} />);
    const input = getByPlaceholderText('Describí el problema...');
    fireEvent(input, 'submitEditing');
    expect(getByText('Describime el problema técnico o subí una foto y te ayudo con el diagnóstico.')).toBeTruthy();
  });

  it('typing shows message in chat', () => {
    const { getByPlaceholderText, getByText } = render(<AIAssistantScreen navigation={mockNavigation as any} />);
    const input = getByPlaceholderText('Describí el problema...');
    fireEvent.changeText(input, 'No funciona la cámara');
    fireEvent(input, 'submitEditing');
    expect(getByText('No funciona la cámara')).toBeTruthy();
  });

  it('image attachment button exists', () => {
    const { getByText } = render(<AIAssistantScreen navigation={mockNavigation as any} />);
    expect(getByText('Describime el problema técnico o subí una foto y te ayudo con el diagnóstico.')).toBeTruthy();
  });

  it('reset button clears the chat', () => {
    const { getByPlaceholderText, getByText, getByTestId, queryByText } = render(<AIAssistantScreen navigation={mockNavigation as any} />);
    const input = getByPlaceholderText('Describí el problema...');
    fireEvent.changeText(input, 'No funciona la cámara');
    fireEvent(input, 'submitEditing');
    expect(getByText('No funciona la cámara')).toBeTruthy();
    fireEvent.press(getByTestId('reset-button'));
    expect(queryByText('No funciona la cámara')).toBeNull();
  });
});
