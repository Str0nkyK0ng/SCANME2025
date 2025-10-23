/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        fluxisch: ['Fluxisch Else', 'monospace'],
      },
      extend: {
        keyframes: {
          'flash-red': {
            '0%': { backgroundColor: 'rgba(255,0,0,0.7)' },
            '70%': { backgroundColor: 'rgba(255,0,0,0.7)' },
            '100%': { backgroundColor: 'rgba(255,0,0,0)' },
          },
          'flash-green': {
            '0%': { backgroundColor: 'rgba(0,255,0,0.7)' },
            '70%': { backgroundColor: 'rgba(0,255,0,0.7)' },
            '100%': { backgroundColor: 'rgba(0,255,0,0)' },
          },
        },
        animation: {
          'flash-red': 'flash-red 0.6s ease',
          'flash-green': 'flash-green 0.6s ease',
        },
      },
    },
  },
  plugins: [],
};
