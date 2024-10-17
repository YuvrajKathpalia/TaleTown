/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        merriweatherSans: ['Merriweather Sans', 'sans-serif'],
        afacadFlux: ['Afacad Flux', 'sans-serif'],
        
      },
    },
  },
  plugins: [],
}


