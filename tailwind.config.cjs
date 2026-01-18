module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trail: {
          brown: '#8B7355',
          earth: '#A0826D',
          cream: '#f5f1e8',
        },
        forest: {
          green: '#4A7C59',
          olive: '#6B8E23',
          moss: '#8FBC8F',
        },
      },
      fontFamily: {
        display: ['Righteous', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
