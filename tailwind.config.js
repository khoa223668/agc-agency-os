/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 900:'#0D0F1A', 800:'#111827', 700:'#1A1F35', 600:'#1E2540' },
        brand: { DEFAULT:'#4F8EF7', cyan:'#00D4FF', purple:'#8B5CF6' },
      },
      fontFamily: { sans: ["'Plus Jakarta Sans'", 'system-ui', 'sans-serif'] },
      backdropBlur: { xs:'2px' },
    },
  },
  plugins: [],
}
