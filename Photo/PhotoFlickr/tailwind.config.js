/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./Photo/**/*.{js,ts,jsx,tsx}",
    "./Photo/PhotoFlickr/**/*.{js,ts,jsx,tsx}",
    "./Photo/PhotoFlickr/src/**/*.{js,ts,jsx,tsx}",
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
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}