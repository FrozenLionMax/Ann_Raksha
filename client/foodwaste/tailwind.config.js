/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-white': '#F8F6F2',
        'soft-beige': '#EDE6DB',
        'muted-green': '#7BAE7F',
        'forest-green': '#2F5D50',
        'soft-blue-gray': '#DCE3E8',
        'dark-text': '#1F2937',
        'light-gray': '#FAFAFA',
      }
    },
  },
  plugins: [],
}