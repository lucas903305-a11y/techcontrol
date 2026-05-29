import { formatCurrency, formatDate, formatPhone, getInitials, getStatusColor, getStatusLabel, getPriorityColor } from '../formatters';

describe('formatCurrency', () => {
  it('formats ARS correctly', () => {
    const result = formatCurrency(15000);
    expect(result).toContain('15.000');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });
});

describe('formatDate', () => {
  it('returns short format', () => {
    const result = formatDate('2025-05-20T10:00:00');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('returns relative "Ahora" for recent dates', () => {
    const result = formatDate(new Date(), 'relative');
    expect(result).toBe('Ahora');
  });
});

describe('formatPhone', () => {
  it('removes spaces and dashes', () => {
    expect(formatPhone('+54 11 4555-1234')).toBe('+541145551234');
  });
});

describe('getInitials', () => {
  it('returns first two initials', () => {
    expect(getInitials('Juan Pérez')).toBe('JP');
  });

  it('handles single name', () => {
    expect(getInitials('Juan')).toBe('J');
  });
});

describe('getStatusColor', () => {
  it('returns yellow for pending', () => {
    expect(getStatusColor('pending')).toBe('#F59E0B');
  });

  it('returns gray for unknown', () => {
    expect(getStatusColor('unknown')).toBe('#94A3B8');
  });
});

describe('getStatusLabel', () => {
  it('returns Spanish label', () => {
    expect(getStatusLabel('pending')).toBe('Pendiente');
    expect(getStatusLabel('completed')).toBe('Completado');
  });
});

describe('getPriorityColor', () => {
  it('returns red for high', () => {
    expect(getPriorityColor('high')).toBe('#EF4444');
  });
});
