/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4299e1', // light blue
          DEFAULT: '#3182ce', // medium blue
          dark: '#2c5282', // dark blue
        },
        secondary: {
          light: '#cbd5e0', // light gray
          DEFAULT: '#a0aec0', // medium gray
          dark: '#4a5568', // dark gray
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      animation: {
          'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}