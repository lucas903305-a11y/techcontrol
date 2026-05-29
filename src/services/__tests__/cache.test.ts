import AsyncStorage from '@react-native-async-storage/async-storage';
import { cache } from '../cache';

const NOW = 1000000;

beforeEach(() => {
  AsyncStorage.clear();
  jest.spyOn(Date, 'now').mockReturnValue(NOW);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('cache', () => {
  it('returns null for missing key', async () => {
    const result = await cache.get('missing');
    expect(result).toBeNull();
  });

  it('stores and retrieves data', async () => {
    await cache.set('user', { id: 1, name: 'Test' });
    const result = await cache.get<{ id: number; name: string }>('user');
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('returns null for expired entries', async () => {
    await cache.set('tmp', 'value');
    jest.spyOn(Date, 'now').mockReturnValue(NOW + 5 * 60 * 1000 + 1);
    const result = await cache.get('tmp');
    expect(result).toBeNull();
  });

  it('removes a key', async () => {
    await cache.set('remove_me', 'data');
    await cache.remove('remove_me');
    const result = await cache.get('remove_me');
    expect(result).toBeNull();
  });

  it('clears all cache entries', async () => {
    await cache.set('a', 1);
    await cache.set('b', 2);
    await cache.clear();
    const a = await cache.get('a');
    const b = await cache.get('b');
    expect(a).toBeNull();
    expect(b).toBeNull();
  });

  it('does not clear non-cache keys', async () => {
    await AsyncStorage.setItem('other_key', 'keep');
    await cache.set('cached', 'value');
    await cache.clear();
    const kept = await AsyncStorage.getItem('other_key');
    const removed = await cache.get('cached');
    expect(kept).toBe('keep');
    expect(removed).toBeNull();
  });
});
