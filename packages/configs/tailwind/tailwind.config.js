/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    'app/**/*.{js,ts,jsx,tsx}',
    'lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
      colors: {
        gray: {
          50: '#f7f7f7',
          100: '#f4f4f4',
          200: '#f0f0f0',
          300: '#ebebeb',
          400: '#e5e5e5',
          500: '#dcdcdc',
          600: '#bbbbbb',
          700: '#9f9f9f',
          800: '#686868',
        },
        primary: {
          DEFAULT: '#6559fc',
          100: '#f0eeff',
          200: '#e0defe',
          300: '#d1cdfe',
          400: '#c1bdfe',
          500: '#b2acfd',
          600: '#a39cfd',
          700: '#938bfd',
          800: '#847afc',
          900: '#746afc',
        },
        secondary: {
          DEFAULT: '#1c146d',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
