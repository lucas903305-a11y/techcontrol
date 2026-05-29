import { useAppStore } from '../store';
import { t as translate, SupportedLocale } from '../i18n';

export function useTranslation() {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  const t = (path: string) => translate(path, locale);

  return { t, locale, setLocale };
}
