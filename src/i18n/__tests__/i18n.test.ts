import { t, es, en } from '../index';

function getAllLeafPaths(obj: any, prefix = ''): string[] {
  const paths: string[] = [];
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      paths.push(...getAllLeafPaths(obj[key], path));
    } else {
      paths.push(path);
    }
  }
  return paths;
}

describe('i18n', () => {
  describe('t()', () => {
    it('returns correct Spanish string when locale is es', () => {
      expect(t('common.loading', 'es')).toBe('Cargando...');
    });

    it('returns correct English string when locale is en', () => {
      expect(t('common.loading', 'en')).toBe('Loading...');
    });

    it('returns the path when key does not exist', () => {
      expect(t('nonexistent.key', 'es')).toBe('nonexistent.key');
    });

    it('supports nested keys with dots', () => {
      expect(t('auth.login', 'es')).toBe('Iniciar sesión');
      expect(t('auth.login', 'en')).toBe('Sign in');
    });
  });

  describe('structural parity', () => {
    it('all keys in es exist in en', () => {
      const esPaths = getAllLeafPaths(es);
      const enPaths = new Set(getAllLeafPaths(en));
      const missing = esPaths.filter(p => !enPaths.has(p));
      expect(missing).toEqual([]);
    });

    it('all keys in en exist in es', () => {
      const enPaths = getAllLeafPaths(en);
      const esPaths = new Set(getAllLeafPaths(es));
      const missing = enPaths.filter(p => !esPaths.has(p));
      expect(missing).toEqual([]);
    });

    it('common keys like common.loading and auth.login exist in both', () => {
      expect(t('common.loading', 'es')).toBeDefined();
      expect(t('common.loading', 'en')).toBeDefined();
      expect(t('auth.login', 'es')).toBeDefined();
      expect(t('auth.login', 'en')).toBeDefined();
    });
  });
});
