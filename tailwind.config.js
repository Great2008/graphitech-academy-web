import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0b17',
        surface: '#161328',
        'surface-raised': '#1c1830',
        brand: {
          purple: '#7c3aed',
          violet: '#4c1d95',
          sky: '#38bdf8',
          amber: '#fbbf24',
          green: '#34d399',
          red: '#f87171',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [typography],
}
