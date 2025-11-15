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
        fluxisch: ['Fluxisch Else'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-stroke-mobile': {
          '-webkit-text-stroke-width': '0.03rem',
        },
        '.text-stroke-pc': {
          '-webkit-text-stroke-width': '0.05rem',
        },
      };
      addUtilities(newUtilities, ['responsive']);
    },
    // ...
  ],
};
