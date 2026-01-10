/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ABeeZee', 'system-ui', 'sans-serif'],
      },
      colors: {
        'foodies-yellow': '#FFCC66',
        'foodies-black': '#111827',
      },
    },
  },
  plugins: [],
}
