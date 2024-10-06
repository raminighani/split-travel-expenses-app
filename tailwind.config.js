/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: 'Roboto Mono, monospace',
    },
    extend: {
      height: {
        screen: '100dvh',
      },
      colors: {
        grn: ' #051B11',
        wgrn: '#D1E7DD',
        bgrn: '#198754',
        graytxt: '#CED4DA',
        tablegren: '#A3CFBB',
        mark: '#343A40',
        secondtxt: '#6C757D',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
