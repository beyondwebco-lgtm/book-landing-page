/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-obsidian': '#090806',
        'temple-black': '#11100D',
        'antique-gold': '#C9A45C',
        'burnished-gold': '#8F6B32',
        'warm-ivory': '#F1E7D0',
        'old-paper': '#D8C7A5',
        'muted-saffron': '#A76532',
        'deep-maroon': '#351711',
      },
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        garamond: ['"Cormorant Garamond"', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
      }
    },
  },
  plugins: [],
}
