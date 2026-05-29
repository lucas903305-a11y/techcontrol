import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NewQuoteScreen from '../NewQuoteScreen';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: {
    createQuote: jest.fn(),
    updateQuote: jest.fn(),
    getClients: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('NewQuoteScreen', () => {
  it('renders header "Nuevo presupuesto"', () => {
    const { getByText } = render(<NewQuoteScreen navigation={mockNavigation as any} />);
    expect(getByText('Nuevo presupuesto')).toBeTruthy();
  });

  it('renders "Agregar item" button', () => {
    const { getByText } = render(<NewQuoteScreen navigation={mockNavigation as any} />);
    expect(getByText('Agregar item')).toBeTruthy();
  });

  it('renders item fields (description, quantity, price)', () => {
    const { getByPlaceholderText, getByText } = render(<NewQuoteScreen navigation={mockNavigation as any} />);
    expect(getByPlaceholderText('Descripción del servicio/producto')).toBeTruthy();
    expect(getByText('Cant.')).toBeTruthy();
    expect(getByText('P. Unit.')).toBeTruthy();
  });

  it('renders Subtotal, IVA, TOTAL', () => {
    const { getByText } = render(<NewQuoteScreen navigation={mockNavigation as any} />);
    expect(getByText('Subtotal')).toBeTruthy();
    expect(getByText('IVA (%)')).toBeTruthy();
    expect(getByText('TOTAL')).toBeTruthy();
  });

  it('renders "Generar PDF" button', () => {
    const { getByText } = render(<NewQuoteScreen navigation={mockNavigation as any} />);
    expect(getByText('Generar PDF')).toBeTruthy();
  });

  it('save button validates', async () => {
    const { getByText } = render(<NewQuoteScreen navigation={mockNavigation as any} />);
    await act(async () => {
      fireEvent.press(getByText('Enviar por WhatsApp'));
    });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Ingresá el teléfono del cliente');
  });
});
