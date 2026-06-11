import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeName = 'dark' | 'midnight' | 'ocean';
export type AccentColor = 'blue' | 'green' | 'orange' | 'red' | 'purple';

interface ThemeConfig {
  name: ThemeName;
  label: string;
  colors: {
    bg: string;
    bgSecondary: string;
    bgTertiary: string;
    border: string;
    borderSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
  };
}

interface AccentConfig {
  name: AccentColor;
  label: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  glow: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  dark: {
    name: 'dark',
    label: 'Dark',
    colors: {
      bg: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      border: '#334155',
      borderSecondary: '#475569',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#64748b',
    },
  },
  midnight: {
    name: 'midnight',
    label: 'Midnight',
    colors: {
      bg: '#0c0c1d',
      bgSecondary: '#151530',
      bgTertiary: '#1f1f3a',
      border: '#2e2e4a',
      borderSecondary: '#3a3a5a',
      text: '#e2e8f0',
      textSecondary: '#a0aec0',
      textMuted: '#718096',
    },
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    colors: {
      bg: '#0c1929',
      bgSecondary: '#0f2744',
      bgTertiary: '#1a3a5c',
      border: '#1e3a5f',
      borderSecondary: '#2a4a6f',
      text: '#e0f2fe',
      textSecondary: '#7dd3fc',
      textMuted: '#38bdf8',
    },
  },
};

export const ACCENT_COLORS: Record<AccentColor, AccentConfig> = {
  blue: {
    name: 'blue',
    label: 'Blue',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#3b82f620',
    primaryDark: '#1e40af',
    glow: 'rgba(59, 130, 246, 0.25)',
  },
  green: {
    name: 'green',
    label: 'Green',
    primary: '#10b981',
    primaryHover: '#059669',
    primaryLight: '#10b98120',
    primaryDark: '#047857',
    glow: 'rgba(16, 185, 129, 0.25)',
  },
  orange: {
    name: 'orange',
    label: 'Orange',
    primary: '#f59e0b',
    primaryHover: '#d97706',
    primaryLight: '#f59e0b20',
    primaryDark: '#b45309',
    glow: 'rgba(245, 158, 11, 0.25)',
  },
  red: {
    name: 'red',
    label: 'Red',
    primary: '#ef4444',
    primaryHover: '#dc2626',
    primaryLight: '#ef444420',
    primaryDark: '#b91c1c',
    glow: 'rgba(239, 68, 68, 0.25)',
  },
  purple: {
    name: 'purple',
    label: 'Purple',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primaryLight: '#8b5cf620',
    primaryDark: '#6d28d9',
    glow: 'rgba(139, 92, 246, 0.25)',
  },
};

interface ThemeContextType {
  theme: ThemeName;
  accentColor: AccentColor;
  themeConfig: ThemeConfig;
  accentConfig: AccentConfig;
  setTheme: (theme: ThemeName) => void;
  setAccentColor: (accent: AccentColor) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'crm_theme';
const ACCENT_STORAGE_KEY = 'crm_accent';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('blue');
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme to CSS variables
  const applyTheme = useCallback((themeName: ThemeName) => {
    const config = THEMES[themeName];
    const root = document.documentElement;

    root.style.setProperty('--theme-bg', config.colors.bg);
    root.style.setProperty('--theme-bg-secondary', config.colors.bgSecondary);
    root.style.setProperty('--theme-bg-tertiary', config.colors.bgTertiary);
    root.style.setProperty('--theme-border', config.colors.border);
    root.style.setProperty('--theme-border-secondary', config.colors.borderSecondary);
    root.style.setProperty('--theme-text', config.colors.text);
    root.style.setProperty('--theme-text-secondary', config.colors.textSecondary);
    root.style.setProperty('--theme-text-muted', config.colors.textMuted);

    // Set body background
    document.body.style.backgroundColor = config.colors.bg;
  }, []);

  // Apply accent color to CSS variables
  const applyAccent = useCallback((accentName: AccentColor) => {
    const config = ACCENT_COLORS[accentName];
    const root = document.documentElement;

    root.style.setProperty('--accent-primary', config.primary);
    root.style.setProperty('--accent-primary-hover', config.primaryHover);
    root.style.setProperty('--accent-primary-light', config.primaryLight);
    root.style.setProperty('--accent-primary-dark', config.primaryDark);
    root.style.setProperty('--accent-glow', config.glow);

    // Set CSS color values for Tailwind compatibility
    root.style.setProperty('--color-accent', config.primary);
    root.style.setProperty('--color-accent-hover', config.primaryHover);
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
        const savedAccent = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor | null;

        const themeToUse = savedTheme && THEMES[savedTheme] ? savedTheme : 'dark';
        const accentToUse = savedAccent && ACCENT_COLORS[savedAccent] ? savedAccent : 'blue';

        setThemeState(themeToUse);
        setAccentColorState(accentToUse);
        applyTheme(themeToUse);
        applyAccent(accentToUse);
      } catch (error) {
        console.error('[ThemeContext] Error loading theme:', error);
        applyTheme('dark');
        applyAccent('blue');
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [applyTheme, applyAccent]);

  // Set theme and persist
  const setTheme = useCallback((newTheme: ThemeName) => {
    console.log('[ThemeContext] Setting theme:', newTheme);
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Set accent color and persist
  const setAccentColor = useCallback((newAccent: AccentColor) => {
    console.log('[ThemeContext] Setting accent color:', newAccent);
    setAccentColorState(newAccent);
    localStorage.setItem(ACCENT_STORAGE_KEY, newAccent);
    applyAccent(newAccent);
  }, [applyAccent]);

  const value: ThemeContextType = {
    theme,
    accentColor,
    themeConfig: THEMES[theme],
    accentConfig: ACCENT_COLORS[accentColor],
    setTheme,
    setAccentColor,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
