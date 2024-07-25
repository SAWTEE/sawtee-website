import forms from '@tailwindcss/forms';
import typograpgy from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],
  prefix: '',
  theme: {
    ...defaultTheme,
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
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        bgDarker: 'hsl(var(--background-darker))',
        // bgBody: 'hsl(var(--bg-body))',
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
        megaMenuBg: 'hsl(var(--mega_menu_bg))',
        theme: {
          50: '#e1f8ff',
          100: '#bee4f1',
          200: '#9ad1e5',
          300: '#74bed9',
          400: '#50acce',
          500: '#3892b4',
          600: '#29728d',
          700: '#1a5165',
          800: '#09313f',
          900: '#001219',
        },
        theme_accent: {
          50: '#e3f7fb',
          100: '#cbdfe3',
          200: '#afc8ce',
          300: '#92b2ba',
          400: '#759ca5',
          500: '#5b838b',
          600: '#45666d',
          700: '#30494f',
          800: '#192d31',
          900: '#001115',
        },
        theme_light: {
          50: '#f0f4f3',
          100: '#d9dcdb',
          200: '#bec6c3',
          300: '#a3b0ac',
          400: '#879a94',
          500: '#6d807a',
          600: '#55645f',
          700: '#3e4744',
          800: '#252b29',
          900: '#0b0f0d',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
        serif: ['Inter', ...defaultTheme.fontFamily.serif],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [forms, typograpgy, require('tailwindcss-animate')],
};
