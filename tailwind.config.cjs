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
          olive: '#6B8E23',
          moss: '#7C9A3B',
          sage: '#8B9F6D',
        },
      },
      fontFamily: {
        display: ['Righteous', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
