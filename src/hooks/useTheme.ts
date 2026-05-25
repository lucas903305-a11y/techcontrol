import { useAppStore } from '../store';
import { Colors } from '../theme/colors';

export function useTheme() {
  const isDark = useAppStore((s) => s.isDarkMode);
  const colors = isDark ? Colors.dark : Colors.light;

  return { colors, isDark };
}
