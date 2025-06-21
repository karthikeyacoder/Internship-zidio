export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        text: '#000000',
        brown: {
          light: '#CD853F',
          DEFAULT: '#A0522D',
          dark: '#8B4513'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}