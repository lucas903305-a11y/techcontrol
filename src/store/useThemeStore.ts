import { useAppStore } from './useAppStore';

export function useThemeStore() {
  const isDark = useAppStore((s) => s.isDarkMode);
  const toggle = useAppStore((s) => s.toggleDarkMode);
  const setDark = useAppStore((s) => s.setDarkMode);

  return { isDark, toggle, setDark };
}
