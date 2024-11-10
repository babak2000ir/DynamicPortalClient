/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    './public/index.html',
  ],
  safelist: [
    '[&>*:nth-child(1)]:bg-teal-100',
    '[&>*:nth-child(2)]:bg-teal-100',
    '[&>*:nth-child(3)]:bg-teal-100',
    '[&>*:nth-child(4)]:bg-teal-100',
    '[&>*:nth-child(5)]:bg-teal-100',
    '[&>*:nth-child(6)]:bg-teal-100',
    '[&>*:nth-child(7)]:bg-teal-100',
    '[&>*:nth-child(8)]:bg-teal-100',
    '[&>*:nth-child(9)]:bg-teal-100',
    '[&>*:nth-child(10)]:bg-teal-100',
    '[&>*:nth-child(11)]:bg-teal-100',
    'bg-teal-600',
    'hover:bg-teal-800',
    'bg-red-600',
    'hover:bg-red-800',
    'hover:ring-teal-300',
    'hover:ring-red-300',
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

