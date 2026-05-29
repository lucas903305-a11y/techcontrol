import { formatCurrency, formatDate, formatPhone, getInitials, getStatusColor, getStatusLabel, getPriorityColor } from '../formatters';

describe('formatCurrency', () => {
  it('formats number as ARS currency', () => {
    expect(formatCurrency(1500)).toContain('1.500');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });

  it('formats with decimals', () => {
    expect(formatCurrency(99.99)).toContain('99');
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-05-26T12:00:00') });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats relative: "Ahora" for < 1 min', () => {
    const date = new Date('2026-05-26T11:59:45');
    expect(formatDate(date, 'relative')).toBe('Ahora');
  });

  it('formats relative: "Hace X min" for < 60 min', () => {
    const date = new Date('2026-05-26T11:30:00');
    expect(formatDate(date, 'relative')).toBe('Hace 30 min');
  });

  it('formats relative: "Hace Xh" for < 24h', () => {
    const date = new Date('2026-05-26T08:00:00');
    expect(formatDate(date, 'relative')).toBe('Hace 4h');
  });

  it('formats relative: "Hace Xd" for < 7d', () => {
    const date = new Date('2026-05-24T12:00:00');
    expect(formatDate(date, 'relative')).toBe('Hace 2d');
  });

  it('formats relative: full date for >= 7d', () => {
    const date = new Date('2026-05-10T12:00:00');
    const result = formatDate(date, 'relative');
    expect(result).not.toContain('Hace');
  });

  it('formats short date', () => {
    const date = new Date('2026-05-26T12:00:00');
    const result = formatDate(date, 'short');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats long date', () => {
    const date = new Date('2026-05-26T12:00:00');
    const result = formatDate(date, 'long');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats ISO string date', () => {
    const result = formatDate('2026-05-26T12:00:00', 'short');
    expect(typeof result).toBe('string');
  });
});

describe('formatPhone', () => {
  it('formats Argentine phone', () => {
    const result = formatPhone('+541123456789');
    expect(result).toContain('11');
  });

  it('handles empty string', () => {
    expect(formatPhone('')).toBe('');
  });
});

describe('getInitials', () => {
  it('returns initials for two names', () => {
    expect(getInitials('Juan Pérez')).toBe('JP');
  });

  it('returns single initial for one name', () => {
    expect(getInitials('Juan')).toBe('J');
  });

  it('returns empty for empty string', () => {
    expect(getInitials('')).toBe('');
  });
});

describe('getStatusColor', () => {
  it('returns color for pending', () => {
    expect(getStatusColor('pending')).toBeDefined();
  });

  it('returns color for in_progress', () => {
    expect(getStatusColor('in_progress')).toBeDefined();
  });

  it('returns color for completed', () => {
    expect(getStatusColor('completed')).toBeDefined();
  });
});

describe('getStatusLabel', () => {
  it('returns label for pending', () => {
    expect(getStatusLabel('pending')).toBe('Pendiente');
  });

  it('returns label for completed', () => {
    expect(getStatusLabel('completed')).toBe('Completado');
  });
});

describe('getPriorityColor', () => {
  it('returns color for low', () => {
    expect(getPriorityColor('low')).toBeDefined();
  });

  it('returns color for high', () => {
    expect(getPriorityColor('high')).toBeDefined();
  });

  it('returns color for urgent', () => {
    expect(getPriorityColor('urgent')).toBeDefined();
  });
});
