/**** Tailwind CSS Config ****/
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#5458e1',
          700: '#4546c1',
          800: '#37379a',
          900: '#2f2f7e'
        }
      }
    },
  },
  plugins: [],
}
