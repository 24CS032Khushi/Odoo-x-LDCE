/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#CBD5E1',
        surface: '#E2E8F0',
        'surface-light': '#EEF2F6',
        'surface-dark': '#B0BAC9',
        obsidian: '#0B0F19',
        gold: {
          primary: '#E5B869',
          light: '#FDE68A',
          dark: '#B4833E',
          champagne: '#F3E5D0',
        },
        amber: {
          primary: '#D97706',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        teal: {
          accent: '#0D9488',
          50: '#e6fffa',
          100: '#b2f5ea',
          200: '#81e6d9',
          300: '#4fd1c5',
          400: '#38B2AC',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        abyss: '#0F172A',
        foam: '#CBD5E1',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '32px',
        'btn': '20px',
        'input': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'neu-extruded': '0 12px 28px -4px rgba(0, 0, 0, 0.22), 0 6px 14px -2px rgba(0, 0, 0, 0.15)',
        'neu-extruded-sm': '0 4px 12px -2px rgba(0, 0, 0, 0.16), 0 2px 6px -1px rgba(0, 0, 0, 0.1)',
        'neu-extruded-lg': '0 20px 40px -8px rgba(0, 0, 0, 0.28), 0 8px 16px -4px rgba(0, 0, 0, 0.16)',
        'neu-inset': 'inset 0 3px 8px rgba(0, 0, 0, 0.16), inset 0 1px 3px rgba(0, 0, 0, 0.1)',
        'neu-inset-sm': 'inset 0 2px 5px rgba(0, 0, 0, 0.14), inset 0 1px 2px rgba(0, 0, 0, 0.08)',
        'neu-amber': '0 10px 25px -3px rgba(217, 119, 6, 0.45), 0 4px 10px -2px rgba(0, 0, 0, 0.15)',
        'luxury-glow': '0 0 35px rgba(229, 184, 105, 0.35), 0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      transitionTimingFunction: {
        'tactile': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}
