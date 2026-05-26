/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#1a7d4e',
          600: '#166534',
          DEFAULT: '#1a7d4e',
        },
        apna: {
          green: '#1a7d4e',
          teal: '#00b09b',
          purple: '#7c3aed',
          gray: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
