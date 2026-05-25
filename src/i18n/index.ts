import es from './es';

export type SupportedLocale = 'es';

const translations: Record<SupportedLocale, typeof es> = { es };

export function t(path: string, locale: SupportedLocale = 'es'): string {
  const keys = path.split('.');
  let result: any = translations[locale];
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path;
    }
  }
  return typeof result === 'string' ? result : path;
}

export { es };
