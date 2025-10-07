// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(210 20% 95%)', // #F0F8FF
        secondary: 'hsl(210 40% 96.1%)',
      },
    },
  },
  plugins: [],
}