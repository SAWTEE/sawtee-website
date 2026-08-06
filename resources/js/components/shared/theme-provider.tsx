import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (_theme: Theme) => void;
  resolvedTheme?: 'dark' | 'light';
  systemTheme?: 'dark' | 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => undefined,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Failed to set item from localStorage:', error);
    }
  },
};

const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
};

const getResolvedTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

const applyTheme = (
  newTheme: Theme,
  attribute: string,
  disableTransitionOnChange: boolean
) => {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  const resolvedTheme = getResolvedTheme(newTheme);

  if (disableTransitionOnChange) {
    const css = document.createElement('style');
    css.appendChild(
      document.createTextNode(
        '*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
      )
    );
    document.head.appendChild(css);

    requestAnimationFrame(() => {
      document.head.removeChild(css);
    });
  }

  if (attribute === 'class') {
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute(attribute, resolvedTheme);
  }
};

type ThemeProviderProps = {
  children?: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = safeLocalStorage.getItem(storageKey);
    return (stored as Theme) || defaultTheme;
  });

  const [mounted, setMounted] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() =>
    getResolvedTheme(
      (safeLocalStorage.getItem(storageKey) as Theme) || defaultTheme
    )
  );
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(
    getSystemTheme
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const nextResolved = getResolvedTheme(theme);
    applyTheme(theme, attribute, disableTransitionOnChange);
    setResolvedTheme(nextResolved);
    setSystemTheme(getSystemTheme());
  }, [theme, mounted, attribute, disableTransitionOnChange]);

  useEffect(() => {
    if (!mounted || !enableSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const nextSystem = getSystemTheme();
      setSystemTheme(nextSystem);
      if (theme === 'system') {
        applyTheme('system', attribute, disableTransitionOnChange);
        setResolvedTheme(nextSystem);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, enableSystem, attribute, disableTransitionOnChange]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (newTheme: Theme) => {
      safeLocalStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    resolvedTheme: mounted ? resolvedTheme : undefined,
    systemTheme: mounted ? systemTheme : undefined,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
