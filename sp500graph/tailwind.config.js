/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./assets/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)"
        ],
      },
      fontSize: {
        'xs': "0.35rem",
        'sm': "0.5rem",
        'base': "0.7rem",
        'lg': "0.9 rem",
        'xl': "1 rem",
        "2xl": "1.25rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      strokeDasharray: {
        '2-4': '2,4',
      },
      fontFamily:{
        'roboto':['Roboto', 'sans-serif'],
        'lato':["Lato", 'sans-serif'],
        'opensans':['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.stroke-dasharray-2-4': {
          strokeDasharray: '2, 4',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}