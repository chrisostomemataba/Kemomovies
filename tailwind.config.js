// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors based on the logo
        brand: {
          gold: '#E6B325',     // Logo gold color
          darker: '#E6A00F',   // Darker gold for hover
          lighter: '#F7C64B',  // Lighter gold for accents
        },
        // Netflix-inspired color scheme
        kemo: {
          // Base colors
          primary: '#E50914',   // Netflix red equivalent
          black: '#141414',     // Dark background
          dark: '#181818',      // Card background
          gray: {
            50: '#F5F5F5',
            100: '#E5E5E5',
            200: '#CCCCCC',
            300: '#999999',
            400: '#666666',
            500: '#333333',
            600: '#222222',
            700: '#1F1F1F',
            800: '#141414',
            900: '#0A0A0A',
          },
        },
      },
      fontFamily: {
        sans: ['Netflix Sans', 'Inter', ...fontFamily.sans],
        display: ['Bebas Neue', ...fontFamily.sans],
        logo: ['Raleway', ...fontFamily.sans],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'auth-gradient': 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'scale-up': 'scaleUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      transitionDuration: {
        '400': '400ms',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};