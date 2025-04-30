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
          light: '#4299e1',
          DEFAULT: '#3182ce',
          dark: '#2c5282',
        },
        secondary: {
          light: '#cbd5e0',
          DEFAULT: '#a0aec0',
          dark: '#4a5568',
        },
      },
    },
  },
  plugins: [],
}