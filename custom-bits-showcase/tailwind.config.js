/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#08070b',
          200: '#0a090f',
          300: '#0d0c13',
          border: '#1f1f23',
          borderMuted: '#27272a',
        },
        accent: {
          purple: '#a855f7',
          purpleDark: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
