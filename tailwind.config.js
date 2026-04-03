/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        income: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
        },
        expense: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
