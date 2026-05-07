/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#1a1f2c',
          primary: '#3b82f6',
          secondary: '#64748b'
        }
      }
    },
  },
  plugins: [],
}