/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        'dark-xe': '#191c29',
      },
      boxShadow: {
        'xe-non': 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        're-don': 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
        'au-gold': 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
      },
    },
  },
  plugins: [],
}

