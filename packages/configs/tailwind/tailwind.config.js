const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    'app/**/*.{js,ts,jsx,tsx}',
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
      colors: {
        primary: {
          DEFAULT: '#00AA81',
          50: '#63FFD9',
          100: '#4EFFD4',
          200: '#25FFCB',
          300: '#00FCBF',
          400: '#00D3A0',
          500: '#00AA81',
          600: '#007256',
          700: '#003A2C',
          800: '#000201',
          900: '#000000',
          950: '#000000',
        },
        secondary: {
          DEFAULT: '#3E3D3D',
          50: '#9A9898',
          100: '#908E8E',
          200: '#7C7A7A',
          300: '#676565',
          400: '#535151',
          500: '#3E3D3D',
          600: '#222121',
          700: '#050505',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        territory: {
          DEFAULT: '#575555',
          50: '#B3B1B1',
          100: '#A9A7A7',
          200: '#949292',
          300: '#807D7D',
          400: '#6C6969',
          500: '#575555',
          600: '#3B3939',
          700: '#1E1E1E',
          800: '#020202',
          900: '#000000',
          950: '#000000',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
