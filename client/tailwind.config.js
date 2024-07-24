/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ["Gill Sans", 'sans-serif'],
      },
      // gridTemplateColumns: {
      //   '60/40': '2fr auto',
      // },

    },
  },
  plugins: [],
}

