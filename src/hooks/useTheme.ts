import { useAppStore } from '../store/useAppStore';
import { lightColors, darkColors } from '../theme/colors';

/**
 * Custom hook to get the current theme colors based on the app's theme mode.
 * Use this hook in components to support dynamic theme switching.
 */
export const useTheme = () => {
    const themeMode = useAppStore((state) => state.themeMode);

    const colors = themeMode === 'light' ? lightColors : darkColors;
    const isDark = themeMode === 'dark';

    return {
        colors,
        themeMode,
        isDark,
    };
};
