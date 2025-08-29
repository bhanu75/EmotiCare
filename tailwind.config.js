/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        wellness: {
          pink: '#fce7f3',
          yellow: '#fef3c7',
          orange: '#fed7aa',
          blue: '#dbeafe',
          green: '#d1fae5',
          purple: '#e9d5ff',
          indigo: '#e0e7ff',
          amber: '#fef3c7',
          teal: '#ccfbf1',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
