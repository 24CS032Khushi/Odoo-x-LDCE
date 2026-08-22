/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: '#071019',
        'ocean-deep': '#0b2e2c',
        'ocean-teal': '#14554f',
        'ocean-light': '#1e7b72',
        'ocean-tint': '#2a9d8f',
        foam: '#f4faf9',
        'white-pure': '#ffffff',
        brand: {
          50: '#f4faf9',
          100: '#e4f3f1',
          200: '#bce4df',
          300: '#8ecfc7',
          400: '#4daea4',
          500: '#14554f', // Primary Ocean Teal
          600: '#0f443f',
          700: '#0b2e2c', // Deep Ocean
          800: '#081e1d',
          900: '#071019', // Abyss
          950: '#03080d',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'panel': '20px',
        'pill': '9999px',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(7, 16, 25, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(7, 16, 25, 0.45)',
        'card-soft': '0 4px 20px -2px rgba(7, 16, 25, 0.05)',
      }
    },
  },
  plugins: [],
}
