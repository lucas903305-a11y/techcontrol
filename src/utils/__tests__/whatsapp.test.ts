import { Linking, Platform } from 'react-native';
import { openWhatsApp, openMaps, openEmail } from '../whatsapp';

let mockOpenURL: jest.Mock;

beforeEach(() => {
  mockOpenURL = jest.fn().mockResolvedValue(undefined);
  (Linking as any).openURL = mockOpenURL;
});

function setPlatformOS(os: string) {
  Object.defineProperty(Platform, 'OS', {
    value: os,
    configurable: true,
    writable: true,
  });
}

describe('openWhatsApp', () => {
  beforeEach(() => {
    setPlatformOS('ios');
  });

  it('opens wa.me link on iOS', () => {
    openWhatsApp('+54 11 2345-6789');
    expect(mockOpenURL).toHaveBeenCalledWith('https://wa.me/+541123456789');
  });

  it('includes message when provided', () => {
    openWhatsApp('123456', 'Hola');
    expect(mockOpenURL).toHaveBeenCalledWith('https://wa.me/123456?text=Hola');
  });

  it('falls back to https on error', async () => {
    mockOpenURL.mockRejectedValueOnce(new Error('fail'));
    openWhatsApp('123', 'test');
    await new Promise((r) => setTimeout(r, 10));
    expect(mockOpenURL).toHaveBeenCalledTimes(2);
    expect(mockOpenURL).toHaveBeenLastCalledWith('https://wa.me/123?text=test');
  });

  it('uses whatsapp:// scheme on Android', () => {
    setPlatformOS('android');
    openWhatsApp('123456');
    expect(mockOpenURL).toHaveBeenCalledWith('whatsapp://send?phone=123456');
  });
});

describe('openMaps', () => {
  it('opens maps app on iOS', () => {
    openMaps(-34.6, -58.4);
    expect(mockOpenURL).toHaveBeenCalledWith(
      'maps://app?daddr=-34.6,-58.4&q=',
    );
  });

  it('constructs correct Android geo URL', () => {
    const expected = Platform.select({
      ios: 'maps://app?daddr=-34.6,-58.4&q=Obelisco',
      android: 'geo:-34.6,-58.4?q=-34.6,-58.4(Obelisco)',
      default: 'https://www.google.com/maps/dir/?api=1&destination=-34.6,-58.4',
    });
    openMaps(-34.6, -58.4, 'Obelisco');
    expect(mockOpenURL).toHaveBeenCalledWith(expected);
  });

  it('constructs correct Google Maps fallback URL', () => {
    const expected = Platform.select({
      ios: 'maps://app?daddr=0,0&q=',
      android: 'geo:0,0?q=0,0()',
      default: 'https://www.google.com/maps/dir/?api=1&destination=0,0',
    });
    openMaps(0, 0);
    expect(mockOpenURL).toHaveBeenCalledWith(expected);
  });
});

describe('openEmail', () => {
  it('opens mailto link', () => {
    openEmail('test@test.com');
    expect(Linking.openURL).toHaveBeenCalledWith('mailto:test@test.com');
  });

  it('includes subject when provided', () => {
    openEmail('a@b.com', 'Asunto');
    expect(Linking.openURL).toHaveBeenCalledWith('mailto:a@b.com?subject=Asunto');
  });
});
