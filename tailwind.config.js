/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7c3aed',
          violet: '#4c1d95',
          sky: '#38bdf8',
        },
      },
    },
  },
  plugins: [],
}
