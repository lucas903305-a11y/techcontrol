import { isValidEmail, isValidPhone, isValidUrl, isStrongPassword } from '../validators';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user+tag@domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('not-email')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('accepts valid phones', () => {
    expect(isValidPhone('+541145551234')).toBe(true);
    expect(isValidPhone('+54 11 4555-1234')).toBe(true);
  });

  it('rejects short numbers', () => {
    expect(isValidPhone('123')).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('accepts valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  it('rejects invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
  });
});

describe('isStrongPassword', () => {
  it('accepts 8+ chars', () => {
    expect(isStrongPassword('12345678')).toBe(true);
  });

  it('rejects short passwords', () => {
    expect(isStrongPassword('1234567')).toBe(false);
  });
});
