/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azure: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#38bdf8',
          500: '#0078d4',
          600: '#0062b0',
          700: '#004e8c',
          800: '#004275',
          900: '#003763',
          950: '#002342',
        }
      }
    },
  },
  plugins: [],
}
