/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  /*
    No `content` here on purpose: each stylesheet entry declares its own
    `@source` list so the public bundle can exclude admin-only utilities.
    See resources/css/index.css and resources/css/admin.css.
  */
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        bodyBackground: 'hsl(var(--body-background))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        bgDarker: 'hsl(var(--background-darker))',
        borderColor: 'var(--color-border)',
        themeColor: 'hsl(var(--theme-color))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          facebook: 'hsl(221 44% 41%)',
          linkedin: 'hsl(201 100% 35%)',
          twitter: 'hsl(203 89% 53%)',
          youtube: 'hsl(0 100% 50%)',
        },
        theme: {
          /* Scale centered on brand teal #006181 at 600 */
          50: '#e6f4f8',
          100: '#cce9f1',
          200: '#99d3e3',
          300: '#66bdd5',
          400: '#33a7c7',
          450: '#4da3c0',
          500: '#1a8aab',
          600: '#006181',
          700: '#004d67',
          800: '#003a4d',
          900: '#002633',
          foam: '#7ec4d8',
          lift: '#0a7a9c',
          ink: '#0b3a48',
          mist: '#e8f6fb',
        },
        success: {
          DEFAULT: '#16a34a',
          foreground: '#f0fdf4',
          muted: '#f0fdf4',
        },
        warning: {
          DEFAULT: '#c2410c',
          foreground: '#fff7ed',
          muted: '#ffedd5',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        // Prefer CSS --font-sans / --font-serif from index.css @theme; keep JS fallback in sync.
        sans: [
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        serif: [
          'Charter',
          'Iowan Old Style',
          'Palatino Linotype',
          'Palatino',
          'Georgia',
          'Times New Roman',
          'Times',
          'serif',
        ],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        marquee: {
          to: {
            transform: 'translateX(-50%)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee var(--duration, 30s) linear infinite',
      },
    },
  },
  plugins: [],
};
